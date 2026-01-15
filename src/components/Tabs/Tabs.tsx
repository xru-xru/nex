import { TabsProvider } from './useTabs';

interface Props {
  defaultTab: string;
  controlledTab?: string;
  children: any;
}

const Tabs = ({ defaultTab, controlledTab = '', children, ...rest }: Props) => {
  return (
    <TabsProvider defaultTab={defaultTab} controlledTab={controlledTab} {...rest}>
      {children}
    </TabsProvider>
  );
};

export default Tabs;
