import { useMemo } from 'react';
import { useSheshaApplication } from '..';
import { IToolboxComponentGroup, IToolboxComponents } from '../../interfaces';
import defaultToolboxComponents from './defaults/toolboxComponents';

export const useFormDesignerComponentGroups = () => {
  const app = useSheshaApplication(false);
  const appComponentGroups = app?.toolboxComponentGroups ?? [];

  const toolboxComponentGroups = useMemo(() => {
    return [...(defaultToolboxComponents || []), ...appComponentGroups];
  }, [defaultToolboxComponents, appComponentGroups]);
  return toolboxComponentGroups;
};

export const toolbarGroupsToComponents = (availableComponents: IToolboxComponentGroup[]): IToolboxComponents => {
  const allComponents: IToolboxComponents = {};
  if (availableComponents) {
    availableComponents.forEach((group) => {
      group.components.forEach((component) => {
        if (component?.type) {
          allComponents[component.type] = component;
        }
      });
    });
  }
  return allComponents;
};

export const useFormDesignerComponents = (): IToolboxComponents => {
  const componentGroups = useFormDesignerComponentGroups();

  const toolboxComponents = useMemo(() => toolbarGroupsToComponents(componentGroups), [componentGroups]);
  return toolboxComponents;
};
