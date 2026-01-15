import Divider from '../../../../../components/Divider';
import FormattedCurrency from '../../../../../components/FormattedCurrency';
import NumberValue from '../../../../../components/NumberValue';
import Tooltip from '../../../../../components/Tooltip';
import { nexyColors } from '../../../../../theme';
import { NexoyaBiddingStrategyType } from '../../../../../types';
import {
  BlueFormula,
  FormulaTooltipContainer,
  FormulaTooltipContent,
  FormulaTooltipHeader,
  FormulaTooltipRow,
  FormulaTooltipTableContainer,
  GreenFormula,
  LabelStyled,
  PurpleFormula,
  StyledSpan,
} from '../../../styles/OptimizationProposal';
import { IRowProposedBiddingStrategy } from '../optimizationDetailsTableTypes';
import { renderBiddingStrategyValueCell, translateBiddingStrategyType } from '../utils';

export const ProposedBiddingStrategyTooltip = ({ proposedBiddingStrategy }: { proposedBiddingStrategy: any }) => {
  const { type } = proposedBiddingStrategy;

  const isTargetRoas =
    hasTRoasFormulaValues(proposedBiddingStrategy) &&
    (type === NexoyaBiddingStrategyType.MaximizeConversionValue || type === NexoyaBiddingStrategyType.TargetRoas);

  const isTargetCpa =
    hasTCpaFormulaValues(proposedBiddingStrategy) &&
    (type === NexoyaBiddingStrategyType.MaximizeConversions || type === NexoyaBiddingStrategyType.TargetCpa);

  if (isTargetRoas) {
    return <TargetRoasTooltip proposedBiddingStrategy={proposedBiddingStrategy} />;
  }

  if (isTargetCpa) {
    return <TargetCpaTooltip proposedBiddingStrategy={proposedBiddingStrategy} />;
  }

  return <DefaultProposedBiddingStrategyTooltip proposedBiddingStrategy={proposedBiddingStrategy} />;
};

const TargetRoasTooltip = ({ proposedBiddingStrategy }: { proposedBiddingStrategy: IRowProposedBiddingStrategy }) => {
  const { realizedRoas, currentTroas, troasDelta, dailyBudgetChange } = proposedBiddingStrategy;

  return (
    <Tooltip
      variant="dark"
      content={
        <FormulaTooltipContent>
          <FormulaTooltipTableContainer>
            <FormulaTooltipHeader>Target ROAS Formula</FormulaTooltipHeader>
            <Divider margin="0" style={{ background: nexyColors.charcoalGrey }} />
            <ElementTooltipRow name="Current TROAS" value={currentTroas} />
            <ElementTooltipRow name="Actual ROAS" value={realizedRoas} />
            <ElementTooltipRow name="TROAS Delta (%)" value={troasDelta} />
          </FormulaTooltipTableContainer>
          <Divider margin="0" style={{ background: nexyColors.charcoalGrey }} />
          <FormulaTooltipContainer>{TroasFormulaDescription(dailyBudgetChange)}</FormulaTooltipContainer>
        </FormulaTooltipContent>
      }
      popperProps={{
        style: {
          zIndex: 3305,
        },
      }}
    >
      <div className="flex flex-col items-center">
        {renderBiddingStrategyValueCell(proposedBiddingStrategy)}
        <LabelStyled>Target ROAS</LabelStyled>
      </div>
    </Tooltip>
  );
};

const DefaultProposedBiddingStrategyTooltip = ({
  proposedBiddingStrategy,
}: {
  proposedBiddingStrategy: IRowProposedBiddingStrategy;
}) => {
  const { type } = proposedBiddingStrategy;

  return (
    <Tooltip
      variant="dark"
      content={translateBiddingStrategyType(type)}
      popperProps={{
        style: {
          zIndex: 3305,
        },
      }}
    >
      <div className="flex flex-col items-center">
        {renderBiddingStrategyValueCell(proposedBiddingStrategy)}
        <LabelStyled>{translateBiddingStrategyType(type)}</LabelStyled>
      </div>
    </Tooltip>
  );
};

const TargetCpaTooltip = ({ proposedBiddingStrategy }: { proposedBiddingStrategy: IRowProposedBiddingStrategy }) => {
  const { dailyBudgetChange, realizedCpa, currentTcpa, tcpaDelta } = proposedBiddingStrategy;

  return (
    <Tooltip
      variant="dark"
      content={
        <FormulaTooltipContent>
          <FormulaTooltipTableContainer>
            <FormulaTooltipHeader>Target CPA Formula</FormulaTooltipHeader>
            <Divider margin="0" style={{ background: nexyColors.charcoalGrey }} />
            <ElementTooltipRow name="Current TCPA" value={currentTcpa} isCurrency />
            <ElementTooltipRow name="Actual CPA" value={realizedCpa} isCurrency />
            <ElementTooltipRow name="TCPA Delta (%)" value={tcpaDelta} />
          </FormulaTooltipTableContainer>
          <Divider margin="0" style={{ background: nexyColors.charcoalGrey }} />
          <FormulaTooltipContainer>{TcpaFormulaDescription(dailyBudgetChange)}</FormulaTooltipContainer>
        </FormulaTooltipContent>
      }
      popperProps={{
        style: {
          zIndex: 3305,
        },
      }}
    >
      <div className="flex flex-col items-center">
        {renderBiddingStrategyValueCell(proposedBiddingStrategy)}
        <LabelStyled>Target CPA</LabelStyled>
      </div>
    </Tooltip>
  );
};

const TcpaFormulaDescription = (dailyBudgetChange: number) => {
  const isPositiveDailyBudgetChange = dailyBudgetChange > 0;

  return (
    <>
      <BlueFormula>Proposed TCPA</BlueFormula> = <GreenFormula>Current TCPA</GreenFormula>
      <PurpleFormula> * </PurpleFormula>
      <PurpleFormula>(</PurpleFormula>
      <PurpleFormula>1</PurpleFormula>
      <PurpleFormula> + </PurpleFormula>
      <GreenFormula>0.7</GreenFormula>
      <PurpleFormula> * </PurpleFormula>
      <GreenFormula>Daily Budget Change</GreenFormula>
      <PurpleFormula> * </PurpleFormula>
      <PurpleFormula>(</PurpleFormula>
      <PurpleFormula>1</PurpleFormula>
      {isPositiveDailyBudgetChange ? <PurpleFormula> - </PurpleFormula> : <PurpleFormula> + </PurpleFormula>}
      <GreenFormula>TCPA Delta</GreenFormula>
      <PurpleFormula> * </PurpleFormula>
      <PurpleFormula>(</PurpleFormula>
      <PurpleFormula>1</PurpleFormula>
      {isPositiveDailyBudgetChange ? <PurpleFormula> - </PurpleFormula> : <PurpleFormula> + </PurpleFormula>}
      <GreenFormula>Application Delta</GreenFormula>
      <PurpleFormula>)</PurpleFormula>
      <PurpleFormula>)</PurpleFormula>
    </>
  );
};

const TroasFormulaDescription = (dailyBudgetChange: number) => {
  const isPositiveDailyBudgetChange = dailyBudgetChange > 0;

  return (
    <>
      <BlueFormula>Proposed TROAS</BlueFormula> = <GreenFormula>Current TROAS</GreenFormula>
      <PurpleFormula> * </PurpleFormula>
      <PurpleFormula>(</PurpleFormula>
      <PurpleFormula>1</PurpleFormula>
      <PurpleFormula> - </PurpleFormula>
      <GreenFormula>0.7</GreenFormula>
      <PurpleFormula> * </PurpleFormula>
      <GreenFormula>Daily Budget Change</GreenFormula>
      <PurpleFormula> * </PurpleFormula>
      <PurpleFormula>(</PurpleFormula>
      <PurpleFormula>1</PurpleFormula>
      {isPositiveDailyBudgetChange ? <PurpleFormula> + </PurpleFormula> : <PurpleFormula> - </PurpleFormula>}
      <GreenFormula>TROAS Delta</GreenFormula>
      <PurpleFormula>)</PurpleFormula>
      <PurpleFormula> * </PurpleFormula>
      <PurpleFormula>(</PurpleFormula>
      <PurpleFormula>1</PurpleFormula>
      {isPositiveDailyBudgetChange ? <PurpleFormula> - </PurpleFormula> : <PurpleFormula> + </PurpleFormula>}
      <GreenFormula> Application Delta</GreenFormula>
      <PurpleFormula>)</PurpleFormula>
      <PurpleFormula>)</PurpleFormula>
    </>
  );
};

const ElementTooltipRow = ({
  name,
  value,
  isCurrency = false,
}: {
  name: string;
  value: number;
  isCurrency?: boolean;
}) => {
  return (
    <FormulaTooltipRow>
      <StyledSpan>{name}</StyledSpan>
      {isCurrency ? (
        <FormattedCurrency amount={value} />
      ) : (
        <NumberValue
          value={value}
          showChangePrefix
          textWithColor
          datatype={{
            suffix: true,
            symbol: '%',
          }}
        />
      )}
    </FormulaTooltipRow>
  );
};

function hasTCpaFormulaValues(proposedBiddingStrategy: IRowProposedBiddingStrategy) {
  return (
    typeof proposedBiddingStrategy.applicationDelta === 'number' &&
    typeof proposedBiddingStrategy.dailyBudgetChange === 'number' &&
    typeof proposedBiddingStrategy.realizedCpa === 'number' &&
    typeof proposedBiddingStrategy.currentTcpa === 'number' &&
    typeof proposedBiddingStrategy.tcpaDelta === 'number'
  );
}

function hasTRoasFormulaValues(proposedBiddingStrategy: IRowProposedBiddingStrategy) {
  return (
    typeof proposedBiddingStrategy.applicationDelta === 'number' &&
    typeof proposedBiddingStrategy.dailyBudgetChange === 'number' &&
    typeof proposedBiddingStrategy.realizedRoas === 'number' &&
    typeof proposedBiddingStrategy.currentTroas === 'number' &&
    typeof proposedBiddingStrategy.troasDelta === 'number'
  );
}
