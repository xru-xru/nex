import styled from 'styled-components';

import { useReportNew } from '../../../context/ReportNewProvider';

import DialogContent from '../../../components/DialogContent';
import Typography from '../../../components/Typography';
import KPISvg from '../../../components/icons/Kpi';

import '../../../theme/theme';

interface WrapStyledProps {
  readonly isSelected: boolean;
}
const reportTypes = [
  {
    title: 'Metrics',
    key: 'KPI',
    description: 'Social index of all your social channels or just the selected ones.',
    icon: <KPISvg />,
  },
];
const GridStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  /* align-items: center; */
  justify-content: space-between;
`;
const WrapStyled = styled.div<WrapStyledProps>`
  cursor: pointer;
  width: 48%;
  padding: 20px;
  margin-bottom: 25px;
  border-width: ${({ isSelected }) => (isSelected ? '2px' : '1px')};
  border-style: solid;
  border-color: ${({ isSelected, theme }) => (isSelected ? theme.colors.primary : 'rgba(223, 225, 237, 0.66)')};
  border-radius: 5px;
  box-shadow: ${({ isSelected }) => (isSelected ? 'none' : '0 2px 4px -1px rgba(54, 55, 59, 0.11)')};

  /* TODO: this needs to be fixed with a proper outline */
  &:focus {
    outline: 0;
  }

  span {
    display: block;
    font-size: 48px;
    margin-bottom: 16px;
  }

  h3 {
    margin-bottom: 9px;
  }
`;

function SelectReportType() {
  const { type, dialogState, sidepanelState, stepper } = useReportNew();
  return (
    <DialogContent data-cy="reportTypeContent">
      <GridStyled>
        {reportTypes.map((rt) => {
          const ReportType = (
            <WrapStyled
              tabIndex={0}
              role="button"
              onClick={() => {
                dialogState.toggleDialog();
                sidepanelState.toggleSidePanel();
                stepper.nextStep();
                type.handleChange(rt.key);
              }}
              key={rt.key}
              isSelected={rt.key === type.value}
              data-cy={`reportType-${rt.key}`}
            >
              <span
                style={{
                  fontSize: '48px',
                }}
              >
                {rt.icon}
              </span>
              <h3>{rt.title}</h3>
              <Typography variant="paragraph" withEllipsis={false}>
                {rt.description}
              </Typography>
            </WrapStyled>
          );

          return ReportType;
        })}
      </GridStyled>
    </DialogContent>
  );
}

export default SelectReportType;
