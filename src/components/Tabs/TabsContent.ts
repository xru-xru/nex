//
import { useTabs } from './useTabs';

interface Props {
  tab: string;
  children: any;
}

const TabsContent = ({ tab, children }: Props) => {
  const { tab: activeTab } = useTabs();

  if (tab !== activeTab) {
    return null;
  }

  return children;
};

export default TabsContent;
