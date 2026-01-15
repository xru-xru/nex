import {
  StyledTooltipRow,
  TooltipLimitedContainer,
  TooltipLimitedTextContainer,
  TooltipLimitedTitle,
} from '../../styles/OptimizationProposal';

type Props = {
  description: JSX.Element | string;
  title: string;
  icon?: JSX.Element;
};

export function TooltipLimited({ description, title, icon }: Props) {
  return (
    <TooltipLimitedContainer>
      <TooltipLimitedTextContainer>
        {title ? (
          <TooltipLimitedTitle>
            {title} {icon}
          </TooltipLimitedTitle>
        ) : null}
        <StyledTooltipRow>
          <span style={{ maxWidth: 500, fontSize: 12 }}>{description}</span>
        </StyledTooltipRow>
      </TooltipLimitedTextContainer>
    </TooltipLimitedContainer>
  );
}
