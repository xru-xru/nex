import React, { useEffect, useRef, useState } from 'react';

import styled from 'styled-components';

import { NexoyaPortfolioParentContent } from '../../../types';

import { useUpdatePortfolioContentBudgetBoundaries } from '../../../graphql/portfolio/mutationUpdatePortfolioContentBudgetBoundaries';

import MenuList from '../../../components/ArrayMenuList/ArrayMenuList';
import Button from '../../../components/Button';
import ButtonAdornment from '../../../components/ButtonAdornment';
import ButtonAsync from '../../../components/ButtonAsync';
import Dialog from '../../../components/Dialog';
import DialogActions from '../../../components/DialogActions';
import DialogContent from '../../../components/DialogContent';
import DialogTitle from '../../../components/DialogTitle';
import { useDropdownMenu } from '../../../components/DropdownMenu';
import ErrorMessage from '../../../components/ErrorMessage';
import Input from '../../../components/Input';
import MenuItem from '../../../components/MenuItem';
import Panel from '../../../components/Panel';
import Text from '../../../components/Text';
import Typography from '../../../components/Typography';
import SvgCaretDown from '../../../components/icons/CaretDown';
import { TrashOutline } from '../../../components/icons/TrashOutline';

import { nexyColors } from '../../../theme';
import { useCurrencyStore } from 'store/currency-selection';
import { useRouteMatch } from 'react-router';

const StyledEmoji = styled.span`
  display: block;
  font-size: 48px;
  line-height: 48px;
  margin-top: 32px;
  margin-bottom: 20px;
`;

const StyledDescription = styled.p`
  max-width: 355px;
  font-weight: 400;
  color: ${nexyColors.blueGrey};
  display: inline-block;
  letter-spacing: 0.2px;
  line-height: 21px;
  margin-bottom: 32px;
`;

const ButtonStyled = styled(Button)`
  height: 48px;
  min-width: 355px;
  padding: 10px 12px;
  box-shadow: none;
  border: 1px solid #c7c8d1;
  justify-content: space-between;
  margin-bottom: 32px;
  margin-top: 8px;
`;

const StyledMenuItem = styled(MenuItem)`
  min-width: 125px;
`;

const StyledInput = styled(Input)`
  min-width: 355px;
  margin-top: 8px;
`;

const StyledTypography = styled(Typography)`
  display: inline;
  font-weight: 500;
  color: ${nexyColors.azure};
  padding: 0 !important;

  border-bottom: 2px dotted ${nexyColors.azure};
  border-radius: 4px;
  border-bottom-right-radius: 0;

  &:hover {
    cursor: default;
    background: ${nexyColors.aliceBlue};
  }
`;

const StyledInputLabel = styled.label`
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  color: #585a6a;
  opacity: 0.5;
  margin-bottom: 8px;
`;

const StyledTextButton = styled(Button)`
  color: ${nexyColors.azure};
  margin-top: 12px;
  justify-content: center;

  &:hover {
    color: ${nexyColors.azure};
    text-decoration: underline;
  }
`;

type BudgetLimitType = 'MIN' | 'MAX' | null;

const BudgetLimit = {
  MIN: 'MIN' as BudgetLimitType,
  MAX: 'MAX' as BudgetLimitType,
};

const CTA_TEXT = {
  SAVE: 'Set new budget limit',
  REMOVE: 'Remove budget limit',
};

type Props = {
  isOpen: boolean;
  toggleDialog: () => void;
  parentContent: NexoyaPortfolioParentContent;
};

export function ContentManageBudgetDialog({ parentContent, isOpen, toggleDialog }: Props) {
  const hasBudgetLimit = parentContent?.budgetMin || parentContent?.budgetMax;
  const match = useRouteMatch();
  const portfolioId = parseInt(match.params.portfolioID, 10);
  const anchorElPanel = useRef(null);

  const [budgetLimitType, setBudgetLimitType] = useState<BudgetLimitType>(null);
  const [budgetNumber, setBudgetNumber] = useState<string | number>('');
  const [lastBudgetNumber, setLastBudgetNumber] = useState<string>(undefined);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  const [updateBudgetBoundaries, { loading, error }] = useUpdatePortfolioContentBudgetBoundaries({
    portfolioId,
    contents: [parentContent.portfolioContentId],
    newBudget: {
      [budgetLimitType?.toLowerCase()]: lastBudgetNumber ? parseFloat(lastBudgetNumber) : null,
    },
  });

  const { open, toggleMenu } = useDropdownMenu();

  const { currency, numberFormat } = useCurrencyStore();

  useEffect(() => {
    if (parentContent?.budgetMin) {
      setBudgetNumber(parentContent?.budgetMin);
      setBudgetLimitType(BudgetLimit.MIN);
      numberToText(parentContent?.budgetMin);
    }
    if (parentContent?.budgetMax) {
      setBudgetNumber(parentContent?.budgetMax);
      setBudgetLimitType(BudgetLimit.MAX);
      numberToText(parentContent?.budgetMax);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentContent?.budgetMax, parentContent?.budgetMin, isOpen]);

  const handleToggleModal = () => {
    toggleDialog();
    resetState();
  };

  const resetState = () => {
    setBudgetNumber(null);
    setBudgetLimitType(null);
    setShowSuccessScreen(false);
  };

  const textToNumber = () => {
    setBudgetNumber(lastBudgetNumber);
  };

  const numberToText = (numberToConvert = budgetNumber) => {
    if (numberToConvert === null || numberToConvert === '') {
      setLastBudgetNumber(null);
      setBudgetNumber(null);
      return;
    }

    setLastBudgetNumber(numberToConvert?.toString() || '');
    setBudgetNumber(
      (+numberToConvert).toLocaleString(numberFormat, {
        maximumFractionDigits: 2,
        currency,
        style: 'currency',
      }),
    );
  };

  const handleSubmit = () => {
    updateBudgetBoundaries()
      .then(() => setShowSuccessScreen(true))
      // eslint-disable-next-line no-console
      .catch((err) => console.error(err));
  };

  const handleChangeSelectValue = (selectValue: BudgetLimitType) => {
    setBudgetLimitType(selectValue);
    toggleMenu();
  };

  const renderStringValue = (value: BudgetLimitType) => {
    if (value === BudgetLimit.MIN) {
      return 'Minimum budget limit';
    }
    if (value === BudgetLimit.MAX) {
      return 'Maximum budget limit';
    }
    return 'Select minimum or maximum budget limit';
  };

  const renderSuccessScreen = () => (
    <>
      <DialogTitle>
        <Text component="h3" withEllipsis={false}>
          <StyledEmoji role="img" aria-label="money-bag emoji">
            💰
          </StyledEmoji>
          <Typography style={{ fontWeight: 500 }} withEllipsis={false}>
            The {lastBudgetNumber ? (budgetLimitType === BudgetLimit.MIN ? 'minimum' : 'maximum') : ''} budget limit for{' '}
            <StyledTypography
              withTooltip
              tooltipPlacement="bottom"
              tooltipValue={parentContent?.content?.title}
              tooltipContainerStyle={{ display: 'inline' }}
            >
              the selected content
            </StyledTypography>{' '}
            {lastBudgetNumber ? `is set at ${budgetNumber}` : 'has been removed'}
          </Typography>
        </Text>
      </DialogTitle>
      <DialogContent>
        <StyledDescription style={{ color: nexyColors.davyGray, marginBottom: 0 }}>
          This will be taken into account in the next optimization.
        </StyledDescription>
      </DialogContent>
      <DialogActions style={{ justifyContent: 'center' }}>
        <ButtonAsync
          onClick={(e) => {
            e.stopPropagation();
            handleToggleModal();
          }}
          variant="contained"
          color="primary"
          autoFocus
        >
          Got it
        </ButtonAsync>
      </DialogActions>
    </>
  );

  return (
    <React.Fragment key={parentContent.portfolioContentId}>
      <Dialog
        duration={100}
        isOpen={isOpen}
        onClose={handleToggleModal}
        paperProps={{
          style: {
            width: 425,
            textAlign: showSuccessScreen ? 'center' : 'left',
          },
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {showSuccessScreen ? (
          renderSuccessScreen()
        ) : (
          <>
            <DialogTitle style={{ paddingBottom: 12 }}>
              <Typography variant="h2" withEllipsis={false}>
                Edit content budget limit
              </Typography>
            </DialogTitle>
            <DialogContent>
              <StyledDescription id="optimization-dialog-description">
                You can set either a minimum or maximum budget limit for this content.
              </StyledDescription>
              <StyledInputLabel>Limit type</StyledInputLabel>
              <ButtonStyled
                variant="contained"
                color="secondary"
                type="button"
                disabled={loading || !!parentContent?.budgetMin || !!parentContent?.budgetMax}
                active={open}
                onClick={toggleMenu}
                endAdornment={
                  <ButtonAdornment position="end">
                    <SvgCaretDown
                      style={{
                        transform: `rotate(${open ? '180' : '0'}deg)`,
                      }}
                    />
                  </ButtonAdornment>
                }
                ref={anchorElPanel}
              >
                {renderStringValue(budgetLimitType)}
              </ButtonStyled>
              <Panel
                open={open}
                color="dark"
                anchorEl={anchorElPanel.current}
                placement="bottom"
                popperProps={{
                  style: {
                    zIndex: 1305,
                    minWidth: 355,
                  },
                }}
              >
                <MenuList color="dark">
                  <StyledMenuItem
                    key={BudgetLimit.MIN + 'menu-item'}
                    onClick={() => handleChangeSelectValue(BudgetLimit.MIN)}
                  >
                    Minimum budget limit
                  </StyledMenuItem>
                  <StyledMenuItem
                    key={BudgetLimit.MAX + 'menu-item'}
                    onClick={() => handleChangeSelectValue(BudgetLimit.MAX)}
                  >
                    Maximum budget limit
                  </StyledMenuItem>
                </MenuList>
              </Panel>
              <StyledInputLabel>Budget limit</StyledInputLabel>
              <StyledInput
                id="budget-limit-input"
                type="currency"
                placeholder={
                  parentContent?.budgetMax || parentContent?.budgetMin ? 'No budget limit' : `Enter in ${currency}`
                }
                step={0.01}
                value={budgetNumber ?? ''}
                onFocus={() => textToNumber()}
                onBlur={() => numberToText()}
                onChange={(e) => setBudgetNumber(e.currentTarget.value)}
                error={true}
                disabled={!budgetLimitType}
              />
              {hasBudgetLimit ? (
                <StyledTextButton
                  startAdornment={<TrashOutline style={{ marginRight: 8 }} />}
                  disabled={!budgetLimitType || !budgetNumber || !lastBudgetNumber}
                  onClick={() => {
                    numberToText(null);
                  }}
                >
                  Remove budget limit
                </StyledTextButton>
              ) : null}
            </DialogContent>
            <DialogActions style={{ background: nexyColors.paleWhite }}>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleModal();
                }}
                disabled={loading}
                variant="contained"
              >
                Cancel
              </Button>
              <ButtonAsync
                // Disable button if no budget limit type is selected or if the budget value is not a number
                // but allow to remove the budget limit when the lastBudgetNumber === null
                disabled={
                  loading ||
                  budgetLimitType === null ||
                  lastBudgetNumber === undefined ||
                  Number.isNaN(lastBudgetNumber === null ? null : parseFloat(lastBudgetNumber))
                }
                loading={loading}
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                autoFocus
              >
                {hasBudgetLimit ? (lastBudgetNumber ? CTA_TEXT.SAVE : CTA_TEXT.REMOVE) : CTA_TEXT.SAVE}
              </ButtonAsync>
            </DialogActions>
          </>
        )}
      </Dialog>

      {error ? <ErrorMessage error={error} /> : null}
    </React.Fragment>
  );
}
