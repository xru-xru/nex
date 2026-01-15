import dayjs from 'dayjs';

import { NexoyaPortfolio } from '../../types';

import { DEFAULT_PORTFOLIO_DATE_RANGE, buildPortfolioPathWithDates } from '../../utils/portfolio';

const GLOBAL_DATE_FORMAT = 'YYYY-MM-DD';

describe('buildPortfolioPathWithDates', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return path with default date range when startDate is after default range and endDate is before current UTC date', () => {
    const portfolioNode = {
      portfolioId: '123',
      startDate: dayjs.utc().subtract(2, 'week').format(GLOBAL_DATE_FORMAT),
      endDate: dayjs.utc().subtract(1, 'week').format(GLOBAL_DATE_FORMAT),
    } as unknown as NexoyaPortfolio;
    const result = buildPortfolioPathWithDates(portfolioNode);
    expect(result).toEqual(
      `/portfolios/${portfolioNode.portfolioId}?dateFrom=${portfolioNode.startDate}&dateTo=${portfolioNode.endDate}`
    );
  });

  test('should return path without date parameters when endDate is after current UTC date', () => {
    const portfolioNode = {
      portfolioId: '789',
      startDate: dayjs.utc().subtract(5, 'day').format(GLOBAL_DATE_FORMAT),
      endDate: dayjs.utc().add(1, 'week').format(GLOBAL_DATE_FORMAT),
    } as unknown as NexoyaPortfolio;
    const result = buildPortfolioPathWithDates(portfolioNode);
    expect(result).toEqual(
      `/portfolios/${portfolioNode.portfolioId}?dateFrom=${portfolioNode.startDate}&dateTo=${dayjs()
        .utc()
        .format(GLOBAL_DATE_FORMAT)}`
    );
  });

  test('should return default date range when portfolio dates are within the default date range', () => {
    const portfolioNode = {
      portfolioId: '457',
      startDate: dayjs.utc().subtract(4, 'week').format(GLOBAL_DATE_FORMAT),
      endDate: dayjs.utc().add(1, 'week').format(GLOBAL_DATE_FORMAT),
    } as unknown as NexoyaPortfolio;
    const result = buildPortfolioPathWithDates(portfolioNode);
    const defaultDateFrom = dayjs.utc(DEFAULT_PORTFOLIO_DATE_RANGE.dateFrom).format(GLOBAL_DATE_FORMAT);
    const defaultDateTo = dayjs.utc(DEFAULT_PORTFOLIO_DATE_RANGE.dateTo).format(GLOBAL_DATE_FORMAT);

    expect(result).toEqual(
      `/portfolios/${portfolioNode.portfolioId}?dateFrom=${defaultDateFrom}&dateTo=${defaultDateTo}`
    );
  });

  test('should return path with startDate and endDate as the portfolio dateRanges when the portfolio is completed', () => {
    const portfolioNode = {
      portfolioId: '101',
      startDate: dayjs.utc().subtract(6, 'month').format(GLOBAL_DATE_FORMAT),
      endDate: dayjs.utc().subtract(1, 'month').format(GLOBAL_DATE_FORMAT),
    } as unknown as NexoyaPortfolio;
    const formattedStartDate = dayjs.utc(portfolioNode.startDate).format(GLOBAL_DATE_FORMAT);
    const formattedEndDate = dayjs.utc(portfolioNode.endDate).format(GLOBAL_DATE_FORMAT);
    const result = buildPortfolioPathWithDates(portfolioNode);
    expect(result).toEqual(
      `/portfolios/${portfolioNode.portfolioId}?dateFrom=${formattedStartDate}&dateTo=${formattedEndDate}`
    );
  });
});
