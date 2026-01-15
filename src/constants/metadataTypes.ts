const metadataTypes = {
  bidding_strategy: {
    name: 'Bidding Strategy',
    links: {
      '12': 'https://developers.facebook.com/docs/marketing-api/bidding/overview/bid-strategy',
      '24': 'https://developers.google.com/google-ads/api/reference/rpc/v9/Campaign',
      '34': 'https://developers.google.com/display-video/api/reference/rest/v1/BiddingStrategy',
      '35': 'https://docs.microsoft.com/en-us/advertising/campaign-management-service/biddingscheme?view=bingads-13',
    },
    key_reverse_mappings: {
      '12': 'bid_strategy',
      '13': 'optimizationTargetType',
      '24': 'bidding_strategy_type',
      '34': 'bidStrategy',
      '35': 'BiddingScheme.Type',
    },
    value_type: 'enum',
    enum_reverse_mappings: {
      fixed_bid: {
        name: 'Fixed Bid',
        mappings: {
          '12': 'LOWEST_COST_WITH_BID_CAP',
          '24': ['manual_cpc', 'manual_cpm', 'manual_cpv'],
          '34': 'fixedBid',
          '35': ['ManualCpc', 'ManualCpm', 'ManualCpv'],
        },
      },
      min_CPA: {
        name: 'Maximize spend - minimize Cost per action',
        mappings: {
          '24': 'maximize_conversions',
          '34': 'maximizeSpendAutoBid.performanceGoalType.BIDDING_STRATEGY_PERFORMANCE_GOAL_TYPE_CPA',
        },
      },
      min_CPC: {
        name: 'Maximize spend - minimize Cost per click',
        mappings: {
          '24': 'target_spend',
          '34': 'maximizeSpendAutoBid.performanceGoalType.BIDDING_STRATEGY_PERFORMANCE_GOAL_TYPE_CPC',
        },
      },
      min_VCPM: {
        name: 'Maximize spend - minimize Cost per viewable impression',
        mappings: {
          '34': 'maximizeSpendAutoBid.performanceGoalType.BIDDING_STRATEGY_PERFORMANCE_GOAL_TYPE_VIEWABLE_CPM',
        },
      },
      target_CPA: {
        name: 'Target Cost per action',
        mappings: {
          '12': [
            {
              bid_strategy: 'LOWEST_COST_WITH_MIN_ROAS',
              objective: 'CONVERSIONS',
            },
            {
              bid_strategy: 'LOWEST_COST_WITH_MIN_ROAS',
              optimization_goal: 'CONVERSIONS',
            },
          ],
          '24': 'target_cpa',
          '34': 'performanceGoalAutoBid.performanceGoalType.BIDDING_STRATEGY_PERFORMANCE_GOAL_TYPE_CPA',
          '35': 'TargetCpa',
        },
      },
      target_CPC: {
        name: 'Target Cost per click',
        mappings: {
          '12': [
            {
              bid_strategy: 'LOWEST_COST_WITH_MIN_ROAS',
              objective: 'LINK_CLICKS',
            },
            {
              bid_strategy: 'LOWEST_COST_WITH_MIN_ROAS',
              optimization_goal: 'LINK_CLICKS',
            },
          ],
          '13': 'TARGET_COST_PER_CLICK',
          '24': 'manual_cpc',
          '34': 'performanceGoalAutoBid.performanceGoalType.BIDDING_STRATEGY_PERFORMANCE_GOAL_TYPE_CPC',
        },
      },
      target_VCPM: {
        name: 'Target Cost per viewable impression',
        mappings: {
          '12': [
            {
              bid_strategy: 'LOWEST_COST_WITH_MIN_ROAS',
              optimization_goal: 'IMPRESSIONS',
            },
          ],
          '24': 'target_cpm',
          '34': 'performanceGoalAutoBid.performanceGoalType.BIDDING_STRATEGY_PERFORMANCE_GOAL_TYPE_VIEWABLE_CPM',
        },
      },
      target_ROAS: {
        name: 'Target return on ad spend',
        mappings: {
          '24': 'target_roas',
          '35': 'TargetRoas',
        },
      },
      max_CPC: {
        name: 'Max click / cost per click',
        mappings: {
          '13': 'MAX_CLICK',
          '35': 'MaxClicks',
        },
      },
      max_conversions: {
        name: 'Max conversions',
        mappings: {
          '13': 'MAX_CONVERSION',
          '35': 'MaxConversions',
        },
      },
      max_conversion_value: {
        name: 'Max conversions value',
        mappings: {
          '35': 'MaxConversionValue',
        },
      },
    },
  },
  bid_amount_micros: {
    name: 'Bidding amount micros',
    key_reverse_mappings: {
      '12': 'bid_amount',
      '24': ['cpc_bid_micros', 'cpm_bid_micros', 'cpv_bid_micros'],
      '34': 'bidAmountMicros',
    },
    value_type: 'double',
  },
  target_cost_per_metric_micros: {
    name: 'Target Cost per metric micros',
    key_reverse_mappings: {
      '24': ['target_cpa_micros', 'target_cpm_micros', 'cpc_bid_ceiling_micros'],
      '34': 'performanceGoalAmountMicros',
    },
    value_type: 'double',
  },
  target_roas: {
    name: 'Target ROAS',
    key_reverse_mappings: {
      '24': 'target_roas',
    },
    value_type: 'double',
  },
  budget_setting: {
    name: 'Budget setting',
    key_reverse_mappings: {
      '12': 'budget_setting',
      '35': 'BudgetType',
    },
    value_type: 'string',
  },
  daily_budget_micros: {
    name: 'Daily budget micros',
    key_reverse_mappings: {
      '12': 'daily_budget',
      '13': 'dailyBudget.amount',
      '24': 'budget_amount',
      '34': 'pacing.dailyMaxMicros',
      '35': 'DailyBudget',
    },
    value_type: 'double',
  },
  lifetime_budget_micros: {
    name: 'Lifetime budget micros',
    key_reverse_mappings: {
      '12': 'lifetime_budget',
      '13': 'totalBudget.amount',
      '34': 'campaignFlight.plannedSpendAmountMicros',
    },
    value_type: 'double',
  },
  id: {
    name: 'Id',
    key_reverse_mappings: {
      '12': 'id',
      '24': 'id',
    },
    value_type: 'string',
  },
  start_datetime: {
    name: 'Start datetime',
    key_reverse_mappings: {
      '12': 'start_time',
      '24': 'start_time',
      '34': 'flight.dateRange.startDate',
    },
    value_type: 'date',
  },
  end_datetime: {
    name: 'End datetime',
    key_reverse_mappings: {
      '12': 'end_time',
      '24': 'end_time',
      '34': 'flight.dateRange.endDate',
    },
    value_type: 'date',
  },
};

export default metadataTypes;
