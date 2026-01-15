import SidePanel, { SidePanelContent } from '../SidePanel';

type Props = {
  url: string;
  isOpen: boolean;
  handleClose: () => void;
};

function HelpCenterSidePanel({ url, isOpen, handleClose }: Props) {
  return (
    <SidePanel
      isOpen={isOpen}
      onClose={handleClose}
      onClick={() => null}
      paperProps={{
        style: {
          width: '50%',
          zIndex: 2000,
        },
      }}
    >
      <SidePanelContent>
        <iframe
          sandbox="allow-same-origin allow-scripts"
          referrerPolicy="no-referrer"
          id="kpiHelpPage"
          title="Kpi Help page"
          src={url}
          style={{
            width: '100%',
            border: 'none',
          }}
        />
      </SidePanelContent>
    </SidePanel>
  );
}

export default HelpCenterSidePanel;
