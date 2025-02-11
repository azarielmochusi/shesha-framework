import { Form } from 'antd';
import React, { useEffect, useRef } from 'react';
import { ConfigurableForm, ConfigurableFormInstance } from '../..';
import { IConfigurableActionArguments } from '../../interfaces/configurableAction';
import { FormMarkup } from '../../providers/form/models';

export interface IProps<TModel extends IConfigurableActionArguments> {
  model: TModel;
  markup: FormMarkup;
  onSave: (model: TModel) => void;
  onCancel: () => void;
  onValuesChange?: (changedValues: any, values: TModel) => void;
  readOnly?: boolean;
}

function GenericArgumentsEditor<TModel extends IConfigurableActionArguments>({
  onSave,
  model,
  markup,
  onValuesChange,
  readOnly = false,
}: IProps<TModel>) {
  const [form] = Form.useForm();
  const formRef = useRef<ConfigurableFormInstance>(null);

  useEffect(() => {
    form.resetFields();
  });

  return (
    <ConfigurableForm
      formRef={formRef}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      mode={readOnly ? 'readonly' : 'edit'}
      form={form}
      onFinish={onSave}
      markup={markup}
      initialValues={model}
      onValuesChange={onValuesChange}
    />
  );
}

export default GenericArgumentsEditor;
