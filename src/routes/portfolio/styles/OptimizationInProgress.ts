import styled from 'styled-components';

import { NexoyaOptimizationTaskStatus } from '../../../types';

import Typography from '../../../components/Typography';

import { nexyColors } from '../../../theme';
import { StyledSidePanelActions } from './OptimizationProposal';

export const getStatusStyles = (status: string) => {
  switch (status) {
    case NexoyaOptimizationTaskStatus.Successful:
      return { background: '#E6FBF2', color: '#0EC76A' };
    case NexoyaOptimizationTaskStatus.Skipped:
      return { background: nexyColors.seasalt, color: nexyColors.cloudyBlue };
    case NexoyaOptimizationTaskStatus.Running:
      return { background: '#FFEFDE', color: nexyColors.pumpkinOrange };
    case NexoyaOptimizationTaskStatus.Failed:
      return { background: '#FDE9F2', color: '#AE1717' };
    case NexoyaOptimizationTaskStatus.Pending:
      return { background: '#eaeaea', color: '#CBCBCB' };
    default:
      return { background: '#eaeaea', color: nexyColors.darkGrey };
  }
};

const statusStyles = {
  [NexoyaOptimizationTaskStatus.Running]: { opacity: '1', background: nexyColors.seasalt },
  [NexoyaOptimizationTaskStatus.Failed]: { opacity: '1', background: '#FDF5FA' },
  [NexoyaOptimizationTaskStatus.Pending]: { opacity: '1', background: '' },
};

export const Wrapper = styled.div`
  border-radius: 5px;
  border: 1px solid #eaeaea;
  background: #fff;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eaeaea;
`;

export const LeftHeader = styled.div`
  display: flex;
`;
export const RightHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 8px;
  overflow-x: scroll;
`;

export const CalendarDateDivider = styled.div`
  display: flex;
  width: 100%;
  height: 1px;
  background: #eaeaea;
`;
export const CalendarDateWrapper = styled.div`
  display: flex;
  padding: 16px;
  width: 170px;
  align-items: center;
  border-right: 1px solid #eaeaea;
`;

export const HeaderTag = styled(Typography)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-evenly;
  gap: 8px;
  padding: 16px;
  border-right: 1px solid #eaeaea;
  font-weight: 500;
`;
export const HeaderTagLabel = styled.div`
  color: #131314;
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 145%; /* 15.95px */
  letter-spacing: 0.44px;
`;
export const HeaderTagValue = styled.div`
  font-size: 12px;
  display: flex;
  padding: 4px 8px;
  align-items: center;
  border-radius: 5px;
  background: #eaeaea;
  color: ${nexyColors.darkGrey};
`;

const Tag = styled.div`
  display: flex;
  padding: 4px 8px;
  align-items: center;
  border-radius: 5px;
  background: #eaeaea;
  color: ${nexyColors.darkGrey};
`;

export const StatusTag = styled(Tag)<{ status: string }>`
  font-size: 12px;
  border-radius: 25px;
  display: inline-flex;
  padding: 6px 16px;
  justify-content: center;
  align-items: center;
  height: fit-content;
  gap: 8px;

  ${({ status }) => {
    const { background, color } = getStatusStyles(status);
    return `
      background: ${background};
      color: ${color};
    `;
  }}
`;

export const StatusNumber = styled(StatusTag)`
  border-radius: 100%;
  width: 24px;
  height: 24px;
  color: white;
  padding: 5px 10px;
  line-height: 100%;
  font-size: 15px;
  ${({ status }) => {
    const { color } = getStatusStyles(status);
    if (status === NexoyaOptimizationTaskStatus.Pending) {
      return { background: 'white', color, border: `2px solid ${color}` };
    }
    if (status === NexoyaOptimizationTaskStatus.Running) {
      return { background: 'white', color, border: `2px dashed ${color}` };
    }
    return { background: color };
  }};
`;

export const StepsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Step = styled.div<{ status: NexoyaOptimizationTaskStatus }>`
  display: flex;
  justify-content: space-between;
  padding: 16px 16px 16px 16px;
  width: 100%;
  min-height: 125px;
  opacity: ${({ status }) => statusStyles[status]?.opacity};
  background: ${({ status }) => statusStyles[status]?.background};
`;

export const StepInfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  width: 100%;
`;

export const StepTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

export const StepTitle = styled.div`
  color: ${nexyColors.darkGrey};
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 145%; /* 20.3px */
  letter-spacing: 0.56px;
`;

export const StepDescription = styled.div`
  color: ${nexyColors.darkGreyTwo};
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  max-width: 400px;
`;

export const StepStatus = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

export const StepIconLine = styled.div<{ status: string }>`
  width: 2.5px;
  height: 100%;
  border-radius: 4px;
  background: ${({ status }) => {
    const { color } = getStatusStyles(status);
    return color;
  }};
`;

export const VerticalStepLine = styled(StepIconLine)`
  height: 3.5px;
  width: 60px;
  border-radius: 20px;
  margin-bottom: 18px;
`;

export const VerticalStepsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StepActionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const StepDivider = styled.div`
  width: 100%;
  height: 1px;
  background: #eaeaea;
`;

export const OptimizationProposalContainer = styled.div`
  background: ${nexyColors.seasalt};
  padding: 16px;

  ${StyledSidePanelActions} {
    padding-right: 0;
    padding-left: 1px;
  }
`;
