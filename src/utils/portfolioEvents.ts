import { NexoyaEventCategory } from '../types';

export const humanReadableEventCategory = (category: NexoyaEventCategory) => {
  switch (category) {
    case NexoyaEventCategory.ProductLaunch:
      return `${getEmojiForCategory(category)} Product Launch`;
    case NexoyaEventCategory.PromotionAndDiscounts:
      return `${getEmojiForCategory(category)} Low Funnel Push`;
    case NexoyaEventCategory.BrandAwareness:
      return `${getEmojiForCategory(category)} High Funnel Push`;
    case NexoyaEventCategory.PositiveExternalEffects:
      return `${getEmojiForCategory(category)} Higher Activity`;
    case NexoyaEventCategory.NegativeExternalEffects:
      return `${getEmojiForCategory(category)} Lower Activity`;
    default:
      return category;
  }
};

export const getEmojiForCategory = (category: NexoyaEventCategory) => {
  switch (category) {
    case NexoyaEventCategory.BrandAwareness:
      return '📢';
    case NexoyaEventCategory.NegativeExternalEffects:
      return '💤';
    case NexoyaEventCategory.ProductLaunch:
      return '🚀';
    case NexoyaEventCategory.PositiveExternalEffects:
      return '🔥';
    case NexoyaEventCategory.PromotionAndDiscounts:
      return '💸';
    case NexoyaEventCategory.PriceIncrease:
      return '💲';
    case NexoyaEventCategory.TrackingIssue:
      return '⚡️';
  }
};

export const getCategoryInfo = (category: NexoyaEventCategory) => {
  switch (category) {
    case NexoyaEventCategory.BrandAwareness:
      return {
        title: '📢 Brand Awareness',
        description: 'This includes awareness flights, offline marketing, TV and more.',
      };
    case NexoyaEventCategory.NegativeExternalEffects:
      return {
        title: '💤 Negative external effects',
        description:
          'Periods of lower market activity. Often tied to holidays, specific external, macroeconomic changes and competitor activity.',
      };
    case NexoyaEventCategory.ProductLaunch:
      return {
        title: '🚀 Product Launch',
        description: 'This includes the launch of a new product or product category.',
      };
    case NexoyaEventCategory.PositiveExternalEffects:
      return {
        title: '🔥 Positive external effects',
        description:
          'Periods of higher market activity. Often tied to holidays, specific external, macroeconomic changes and competitor activity.',
      };
    case NexoyaEventCategory.PromotionAndDiscounts:
      return {
        title: '💸 Promotion and discounts',
        description: 'This includes price decreases, special offers, loyalty push and low funnel push efforts.',
      };
    case NexoyaEventCategory.PriceIncrease:
      return {
        title: '💲 Price increase',
        description: 'This includes markups, price changes, and more.',
      };
    case NexoyaEventCategory.TrackingIssue:
      return {
        title: '⚡️ Tracking issues',
        description:
          'The event timeframe either has no performance data or inaccurate data. We will not use this category for its Machine Learning training purposes.',
      };
  }
};
