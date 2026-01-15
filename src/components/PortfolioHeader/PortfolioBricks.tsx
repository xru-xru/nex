import React from 'react';

import dayjs from 'dayjs';
import styled from 'styled-components';

import { NexoyaPortfolioTargetItem, NexoyaPortfolioType, NexoyaPortfolioV2 } from '../../types';

import { GLOBAL_DATE_FORMAT, PORTFOLIO_FORMAT } from '../../utils/dates';

import * as Styles from '../../routes/portfolio/styles/Portfolio';

import { nexyColors } from '../../theme';
import FormattedCurrency from '../FormattedCurrency';
import { HeaderBrickWrap } from '../HeaderBrick';
import NumberValue from '../NumberValue';
import PercentCircle from '../PercentCircle';
import { PortfolioTargetTypeSwitch } from '../PortfolioTypeSwitch';
import Tooltip from '../Tooltip';
import Typography from '../Typography';
import SvgCostPerSymbol from '../icons/CostPerSymbol';
import SvgDuration from '../icons/Duration';
import SvgPortfolioDuotone from '../icons/PortfolioDuotone';
import SvgRoasSymbol from '../icons/RoasSymbol';
import SvgTarget from '../icons/Target';
import SvgTargetDuotone from '../icons/TargetDuotone';
import { usePortfolioV2MetaBudgetQuery } from '../../graphql/portfolio/queryPortfolioMeta';
import { useQueryParamDateRange } from '../../hooks/useQueryParamDateRange';
import { DEFAULT_PORTFOLIO_DATE_RANGE } from '../../utils/portfolio';
import { Skeleton } from '../../components-ui/Skeleton';

const TargetContainerStyled = styled.div`
  .NEXYNumberValue {
    span {
      display: flex;
    }
  }
`;
export const WrapBricksStyled = styled.div`
  display: flex;
  justify-content: space-between;

  .NEXYHeaderBrick {
    margin-right: 32px;
  }
`;
export const PortfolioBricks = ({
  portfolio,
  funnelStepTitle,
  loading,
}: {
  portfolio: Partial<NexoyaPortfolioV2>;
  funnelStepTitle: string;
  loading: boolean;
}) => {
  const { dateFrom, dateTo } = useQueryParamDateRange(DEFAULT_PORTFOLIO_DATE_RANGE);
  const isBudgetPortfolio = portfolio?.type === NexoyaPortfolioType.Budget;

  const { data: portfolioMetaBudgetData, loading: budgetLoading } = usePortfolioV2MetaBudgetQuery({
    start: dayjs(dateFrom).utc().format(GLOBAL_DATE_FORMAT),
    end: dayjs(dateTo).utc().format(GLOBAL_DATE_FORMAT),
    portfolioId: isBudgetPortfolio ? portfolio?.portfolioId : null,
  });

  const portfolioType = portfolio?.type;
  const latestAchievedTargetItem: NexoyaPortfolioTargetItem = portfolio?.latestAchievedTargetItem;

  const portfolioMetaBudget = portfolioMetaBudgetData?.portfolioV2?.budget;

  const activeTargetItem = portfolio?.activeTargetItem;

  const getPrimaryTargetStringBasedOnPortfolioType = () => {
    switch (portfolio?.type) {
      case NexoyaPortfolioType.Roas:
        return 'Ratio-per ';
      case NexoyaPortfolioType.CostPer:
        return 'Cost-per ';
      case NexoyaPortfolioType.Budget:
        return '';
      default:
        return '';
    }
  };

  const renderTargetPortfolioHeaderBricks = () => (
    <WrapBricksStyled>
      <HeaderBrickWrap>
        <Styles.HeaderBrickStyled
          icon={
            loading ? (
              <Skeleton style={{ width: 32, height: 32, borderRadius: '50%' }} />
            ) : (
              <SvgDuration
                style={{
                  fontSize: 32,
                }}
              />
            )
          }
          label="DURATION"
          content={
            loading ? (
              <Skeleton style={{ height: '21px', width: '180px' }} />
            ) : (
              `${dayjs(portfolio?.start).format(PORTFOLIO_FORMAT)} - ${dayjs(portfolio?.end)
                .endOf('day')
                .format(PORTFOLIO_FORMAT)}`
            )
          }
          data-cy="portfolioDuration"
        />
        <Styles.HeaderBrickStyled
          icon={
            loading ? (
              <Skeleton style={{ width: 32, height: 32, borderRadius: '50%' }} />
            ) : (
              <SvgPortfolioDuotone
                style={{
                  fontSize: 32,
                }}
              />
            )
          }
          label="PORTFOLIO TYPE"
          content={
            loading ? (
              <Skeleton style={{ height: '21px', width: '100px' }} />
            ) : (
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>Target-based</div>
            )
          }
        />
        <Styles.HeaderBrickStyled
          icon={
            loading ? (
              <Skeleton style={{ width: 32, height: 32, borderRadius: '50%' }} />
            ) : portfolioType === NexoyaPortfolioType.CostPer ? (
              <SvgCostPerSymbol
                style={{
                  fontSize: 32,
                }}
              />
            ) : (
              <SvgRoasSymbol
                style={{
                  fontSize: 32,
                }}
              />
            )
          }
          label="PORTFOLIO TARGET"
          content={
            loading ? (
              <Skeleton style={{ height: '21px', width: '120px' }} />
            ) : (
              getPrimaryTargetStringBasedOnPortfolioType() + funnelStepTitle
            )
          }
        />
        <Styles.HeaderBrickStyled
          icon={
            loading ? (
              <Skeleton style={{ width: 32, height: 32, borderRadius: '50%' }} />
            ) : (
              <SvgTargetDuotone
                style={{
                  fontSize: 32,
                }}
              />
            )
          }
          label="LATEST ACHIEVED"
          content={
            loading ? (
              <Skeleton style={{ height: '21px', width: '150px' }} />
            ) : activeTargetItem ? (
              <Tooltip
                variant="dark"
                size="small"
                content={
                  <>
                    <Typography style={{ display: 'flex', justifyContent: 'space-between' }}>
                      Portfolio target:{' '}
                      <span style={{ color: nexyColors.greenTeal }}>
                        <PortfolioTargetTypeSwitch
                          renderForCPAType={() => <FormattedCurrency amount={latestAchievedTargetItem?.value} />}
                          renderForROASType={() => <NumberValue value={latestAchievedTargetItem?.value} symbol="%" />}
                        />
                      </span>
                    </Typography>
                    <Typography style={{ display: 'flex', justifyContent: 'space-between' }}>
                      Latest achieved portfolio target:{' '}
                      {latestAchievedTargetItem ? (
                        <span style={{ color: nexyColors.greenTeal }}>
                          <PortfolioTargetTypeSwitch
                            renderForCPAType={() => <FormattedCurrency amount={latestAchievedTargetItem?.achieved} />}
                            renderForROASType={() => (
                              <NumberValue value={latestAchievedTargetItem?.achieved} symbol="%" />
                            )}
                          />
                        </span>
                      ) : (
                        '-'
                      )}
                    </Typography>
                  </>
                }
              >
                <TargetContainerStyled>
                  <Typography variant="h4" style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    {latestAchievedTargetItem ? (
                      <PortfolioTargetTypeSwitch
                        renderForCPAType={() => <FormattedCurrency amount={latestAchievedTargetItem?.achieved} />}
                        renderForROASType={() => <NumberValue value={latestAchievedTargetItem?.achieved} symbol="%" />}
                      />
                    ) : (
                      <span>-</span>
                    )}

                    <span style={{ display: 'contents', color: nexyColors.secondaryText }}>
                      /{' '}
                      <PortfolioTargetTypeSwitch
                        renderForCPAType={() => <FormattedCurrency amount={latestAchievedTargetItem?.value} />}
                        renderForROASType={() => <NumberValue value={latestAchievedTargetItem?.value} symbol="%" />}
                      />
                    </span>
                  </Typography>
                </TargetContainerStyled>
              </Tooltip>
            ) : (
              <span style={{ color: nexyColors.coolGray, opacity: 0.5 }}>No active target</span>
            )
          }
        />
      </HeaderBrickWrap>
    </WrapBricksStyled>
  );

  const renderBudgetPortfolioHeaderBricks = () => (
    <WrapBricksStyled>
      <HeaderBrickWrap>
        <Styles.HeaderBrickStyled
          icon={
            loading ? (
              <Skeleton style={{ width: 32, height: 32, borderRadius: '50%' }} />
            ) : (
              <SvgDuration
                style={{
                  fontSize: 32,
                }}
              />
            )
          }
          label="DURATION"
          content={
            loading ? (
              <Skeleton style={{ height: '21px', width: '180px' }} />
            ) : (
              `${dayjs(portfolio?.start).format(PORTFOLIO_FORMAT)} - ${dayjs(portfolio?.end)
                .endOf('day')
                .format(PORTFOLIO_FORMAT)}`
            )
          }
          data-cy="portfolioDuration"
        />
        <Styles.HeaderBrickStyled
          icon={
            loading ? (
              <Skeleton style={{ width: 32, height: 32, borderRadius: '50%' }} />
            ) : (
              <SvgPortfolioDuotone
                style={{
                  fontSize: 32,
                }}
              />
            )
          }
          label="PORTFOLIO TYPE"
          content={loading ? <Skeleton style={{ height: '21px', width: '100px' }} /> : 'Budget-based'}
        />
        <Styles.HeaderBrickStyled
          icon={
            loading ? (
              <Skeleton style={{ width: 32, height: 32, borderRadius: '50%' }} />
            ) : (
              <SvgTarget
                style={{
                  fontSize: 32,
                }}
              />
            )
          }
          label="PORTFOLIO TARGET"
          content={loading ? <Skeleton style={{ height: '21px', width: '120px' }} /> : funnelStepTitle}
        />
        <Styles.HeaderBrickStyled
          icon={
            budgetLoading ? (
              <Skeleton style={{ width: 32, height: 32, borderRadius: '50%' }} />
            ) : (
              <div
                style={{
                  width: 32,
                  height: 32,
                }}
              >
                <PercentCircle
                  percent={
                    portfolioMetaBudget?.spent?.totalSpent
                      ? (portfolioMetaBudget?.spent?.totalSpent / (portfolioMetaBudget.total ?? 100)) * 100
                      : 0
                  }
                  fixed={true}
                  showNumber={false}
                  icon={<Styles.SvgDollarStyled />}
                />
              </div>
            )
          }
          label="SPENT"
          content={
            budgetLoading ? (
              <Skeleton style={{ height: '21px', width: '150px' }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FormattedCurrency amount={portfolioMetaBudget?.spent?.totalSpent || 0} showDecimals={false} /> of{' '}
                <FormattedCurrency amount={portfolioMetaBudget?.total || 0} showDecimals={false} />
              </div>
            )
          }
        />
      </HeaderBrickWrap>
    </WrapBricksStyled>
  );

  return isBudgetPortfolio ? renderBudgetPortfolioHeaderBricks() : renderTargetPortfolioHeaderBricks();
};
