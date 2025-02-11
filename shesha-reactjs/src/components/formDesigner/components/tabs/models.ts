import { IConfigurableItemBase } from '../../../../providers/itemListConfigurator/contexts';
import { TabPaneProps } from 'antd';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { IConfigurableFormComponent } from '../../../../interfaces';

export interface ITabPaneProps
  extends IConfigurableItemBase,
    Omit<TabPaneProps, 'children' | 'tab' | 'style' | 'tabKey'> {
  id: string;
  icon?: string;
  key: string;
  title: string;
  customVisibility?: string;
  customEnabled?: string;
  permissions?: string[];
  components?: IConfigurableFormComponent[];
  childItems?: ITabPaneProps[];
}

export interface ITabsComponentProps extends IConfigurableFormComponent {
  tabs: ITabPaneProps[];
  size?: SizeType;
  defaultActiveKey?: string;
  tabType?: 'line' | 'card';
  permissions?: string[];
  hidden?: boolean;
  customVisibility?: string;
  position?: 'left' | 'right' | 'top' | 'bottom';
}
