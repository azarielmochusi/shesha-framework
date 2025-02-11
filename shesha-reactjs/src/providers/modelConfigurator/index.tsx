import { FormInstance } from 'antd';
import React, { FC, MutableRefObject, PropsWithChildren, useContext, useEffect, useReducer } from 'react';
import {
  ModelConfigurationDto,
  entityConfigDelete,
  modelConfigurationsCreate,
  modelConfigurationsGetById,
  modelConfigurationsUpdate,
} from '../../apis/modelConfigurations';
import { useSheshaApplication } from '../../providers';
import {
  changeModelIdAction,
  createNewAction,
  deleteErrorAction,
  deleteRequestAction,
  deleteSuccessAction,
  loadErrorAction,
  loadRequestAction,
  loadSuccessAction,
  saveErrorAction,
  saveRequestAction,
  saveSuccessAction,
} from './actions';
import {
  MODEL_CONFIGURATOR_CONTEXT_INITIAL_STATE,
  ModelConfiguratorActionsContext,
  ModelConfiguratorStateContext,
} from './contexts';
import { IModelConfiguratorInstance } from './interfaces';
import modelReducer from './reducer';

export interface IModelConfiguratorProviderPropsBase {
  baseUrl?: string;
}

export interface IModelConfiguratorProviderProps {
  id?: string;
  form: FormInstance;
  configuratorRef?: MutableRefObject<IModelConfiguratorInstance | null>;
}

const ModelConfiguratorProvider: FC<PropsWithChildren<IModelConfiguratorProviderProps>> = (props) => {
  const { children } = props;

  const { backendUrl, httpHeaders } = useSheshaApplication();

  const [state, dispatch] = useReducer(modelReducer, {
    ...MODEL_CONFIGURATOR_CONTEXT_INITIAL_STATE,
    id: props.id,
    form: props.form,
  });

  useEffect(() => {
    load();
  }, [state.id]);

  /* NEW_ACTION_DECLARATION_GOES_HERE */

  const changeModelId = (id: string) => {
    dispatch(changeModelIdAction(id));
  };

  const createNew = (model: ModelConfigurationDto) => {
    dispatch(createNewAction(model));
  };

  const load = () => {
    if (state.id) {
      dispatch(loadRequestAction());

      // { name: state.className, namespace: state.namespace }
      modelConfigurationsGetById({}, { id: state.id, base: backendUrl, headers: httpHeaders })
        .then((response) => {
          if (response.success) {
            dispatch(loadSuccessAction(response.result));
          } else dispatch(loadErrorAction(response.error));
        })
        .catch((e) => {
          dispatch(loadErrorAction({ message: 'Failed to load model', details: e }));
        });
    } /*
    else
      console.error("Failed to fetch a model configuraiton by Id - Id not specified");*/
  };

  const submit = () => {
    state.form.submit();
  };

  const prepareValues = (values: ModelConfigurationDto): ModelConfigurationDto => {
    return { ...values, id: state.id };
  };

  const save = (values: ModelConfigurationDto): Promise<ModelConfigurationDto> =>
    new Promise<ModelConfigurationDto>((resolve, reject) => {
      // todo: validate all properties
      const preparedValues = prepareValues(values);

      dispatch(saveRequestAction());

      const mutate = state.id ? modelConfigurationsUpdate : modelConfigurationsCreate;

      mutate(preparedValues, { base: backendUrl, headers: httpHeaders })
        .then((response) => {
          if (response.success) {
            dispatch(saveSuccessAction(response.result));
            resolve(response.result);
          } else {
            dispatch(saveErrorAction(response.error));
            reject();
          }
        })
        .catch((error) => {
          dispatch(saveErrorAction({ message: 'Failed to save model', details: error }));
          reject();
        });
    });

  const getModelSettings = () => prepareValues(state.form.getFieldsValue());

  const savePromise: () => Promise<ModelConfigurationDto> = () =>
    new Promise<ModelConfigurationDto>((resolve, reject) => {
      state.form
        .validateFields()
        .then((values) => {
          // merge values to avoid losing invisible data
          save({ ...state.modelConfiguration, ...values })
            .then((item) => resolve(item))
            .catch(() => reject());
        })
        .catch((error) => reject(error));
    });

  const deleteFunc = (values: ModelConfigurationDto): Promise<void> =>
    new Promise<void>((resolve, reject) => {
      dispatch(deleteRequestAction());

      entityConfigDelete({ base: backendUrl, queryParams: { id: values.id }, headers: httpHeaders })
        .then(() => {
          dispatch(deleteSuccessAction());
          resolve();
        })
        .catch((error) => {
          dispatch(deleteErrorAction({ message: 'Failed to save model', details: error }));
          reject();
        });
    });

  const deletePromise: () => Promise<void> = () =>
    new Promise<void>((resolve, reject) => {
      deleteFunc(state.modelConfiguration)
        .then(() => resolve())
        .catch(() => reject());
    });

  if (props.configuratorRef) {
    props.configuratorRef.current = {
      save: savePromise,
      changeModelId: changeModelId,
      createNew: createNew,
      delete: deletePromise,
    };
  }

  return (
    <ModelConfiguratorStateContext.Provider value={{ ...state }}>
      <ModelConfiguratorActionsContext.Provider
        value={{
          changeModelId,
          load,
          save,
          submit,
          getModelSettings,
          /* NEW_ACTION_GOES_HERE */
        }}
      >
        {children}
      </ModelConfiguratorActionsContext.Provider>
    </ModelConfiguratorStateContext.Provider>
  );
};

function useModelConfiguratorState() {
  const context = useContext(ModelConfiguratorStateContext);

  if (context === undefined) {
    throw new Error('useModelConfiguratorState must be used within a ModelConfiguratorProvider');
  }

  return context;
}

function useModelConfiguratorActions() {
  const context = useContext(ModelConfiguratorActionsContext);

  if (context === undefined) {
    throw new Error('useModelConfiguratorActions must be used within a ModelConfiguratorProvider');
  }

  return context;
}

function useModelConfigurator() {
  return { ...useModelConfiguratorState(), ...useModelConfiguratorActions() };
}

export { ModelConfiguratorProvider, useModelConfigurator };
