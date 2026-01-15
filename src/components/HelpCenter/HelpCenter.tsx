import clsx from 'clsx';
import styled from 'styled-components';

import { colorByKey } from '../../theme/utils';
import SidePanel, { SidePanelContent, useSidePanelState } from '../SidePanel';
import Typography from '../Typography';
import SvgQuestionCircle from '../icons/QuestionCircle';
import ButtonIcon from '../ButtonIcon';
import { nexyColors } from '../../theme';

type Props = {
  url?: string;
  urlText?: string;
  className?: string;
  btnStyle?: Record<string, string | number>;
};
const classes = {
  root: 'NEXYHelpCenter',
};
const WrapStyled = styled.div`
  .NEXYButtonLabel {
    display: flex;
    align-items: center;
  }
`;

interface IIconWrapperStyled {
  position?: string;
}
export const IconWrapperStyled = styled.div<IIconWrapperStyled>`
  position: ${(props) => props.position ?? 'relative'};
  margin-right: 8px;
  margin-left: 8px;
  padding: 2px 6px;
  color: ${colorByKey('cloudyBlue')};
  svg {
    cursor: pointer;
  }
`;

function HelpCenter({ url, urlText, className, btnStyle }: Props) {
  const { isOpen, toggleSidePanel } = useSidePanelState();
  if (!url) return null;
  return (
    <WrapStyled className={clsx(className, classes.root)} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
      <ButtonIcon
        flat={true}
        onClick={toggleSidePanel}
        style={{
          display: 'flex',
          alignItems: 'center',
          margin: '0px 8px',
          ...btnStyle,
        }}
      >
        <SvgQuestionCircle style={{ color: nexyColors.cloudyBlue }} />
        {urlText && <Typography>{urlText}</Typography>}
      </ButtonIcon>
      <SidePanel
        isOpen={isOpen}
        onClose={toggleSidePanel}
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
            referrerPolicy="no-referrer"
            sandbox="allow-same-origin allow-scripts"
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
    </WrapStyled>
  );
}

export default HelpCenter;
