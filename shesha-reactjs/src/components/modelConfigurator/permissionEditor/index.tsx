import React, { FC } from 'react';
import permissionSettingsMarkup from '../permissionSettings.json';
import ConfigurableForm from '../../configurableForm';
import { FormMarkup } from '../../../providers/form/models';
import { Form } from 'antd';
import { PermissionDto } from 'apis/permission';
import { isEqual } from 'lodash';

interface IPermissionEditorComponentProps {
    name: string;
  }

export const PermissionEditorComponent: FC<IPermissionEditorComponentProps> = (props) => {
    return (
        <Form.Item
            name={props.name}
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
        >
            <PermissionEditor {...props} />
        </Form.Item>
    );   
};

interface IPermissionEditorProps extends IPermissionEditorComponentProps {
    value?: PermissionDto;
    onChange?: (value: PermissionDto) => void;    
}

const PermissionEditor: FC<IPermissionEditorProps> = (props) => {
    return (
        <ConfigurableForm
        layout="horizontal"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        mode="edit"
        markup={permissionSettingsMarkup as FormMarkup}
        initialValues={props?.value}
        onValuesChange={(v) =>{
            const d = {...props?.value, ...v};
            if (!isEqual(props?.value, d)) {
                props?.onChange(d);
            }
        }}
        />
    );
};
