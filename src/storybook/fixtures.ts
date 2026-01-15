import { NexoyaFunnelStepType } from '../types';

export const MOCK_TRANSLATIONS = [
  {
    key: '{provider.adition.description}',
    text: 'adition',
  },
  {
    key: '{provider.adition}',
    text: 'adition',
  },
  {
    key: '{provider.adobe.analytics.description}',
    text: 'Adobe Analytics is providing statistics for Website Traffic and analysis. It is the source of this data.',
  },
  {
    key: '{provider.adobe.analytics}',
    text: 'Adobe Analytics',
  },
  {
    key: '{provider.adunittech.description}',
    text: 'Adunit DSP',
  },
  {
    key: '{provider.adunittech}',
    text: 'Adunit DSP',
  },
  {
    key: '{provider.appstore.description}',
    text: 'Browse and download apps to your iPad, iPhone, or iPod touch from the App...',
  },
  {
    key: '{provider.appstore}',
    text: 'Apple App Store',
  },
  {
    key: '{provider.blink.description}',
    text: 'BL.ink is an simple URL shortener, used by major marketing teams around the world.',
  },
  {
    key: '{provider.blink}',
    text: 'BL.ink',
  },
  {
    key: '{provider.exchangeratesapi.description}',
    text: 'Get daily exchange rates for various currencies.',
  },
  {
    key: '{provider.exchangeratesapi}',
    text: 'Exchange Rates',
  },
  {
    key: '{provider.facebook.description}',
    text: 'Connect with friends, family and other people you know. Share...',
  },
  {
    key: '{provider.facebook}',
    text: 'Meta',
  },
  {
    key: '{provider.google.analytics.description}',
    text: 'Google Analytics lets you measure your advertising ROI as well as...',
  },
  {
    key: '{provider.google.analytics}',
    text: 'Google Analytics',
  },
  {
    key: '{provider.google.analytics4.description}',
    text: 'Google Analytics lets you measure your advertising ROI as well as...',
  },
  {
    key: '{provider.google.analytics4}',
    text: 'Google Analytics 4',
  },
  {
    key: '{provider.google.ads.description}',
    text: 'Google Ads is an online advertising platform developed by Google, where advertisers pay...',
  },
  {
    key: '{provider.google.ads}',
    text: 'Google Ads',
  },
  {
    key: '{provider.gplay.description}',
    text: 'Enjoy millions of the latest Android apps, games, music, movies...',
  },
  {
    key: '{provider.gplay}',
    text: 'Google Play Store',
  },
  {
    key: '{provider.hubspot.description}',
    text: 'Hubspot is mainly a Inbound Marketing tool helping you to generate Leads with Content Marketing.',
  },
  {
    key: '{provider.hubspot}',
    text: 'Hubspot',
  },
  {
    key: '{provider.instagram.description}',
    text: 'A simple, fun & creative way to capture, edit & share photos, videos...',
  },
  {
    key: '{provider.instagram}',
    text: 'Instagram (Competitors)',
  },
  {
    key: '{provider.instagramV2.description}',
    text: 'A simple, fun & creative way to capture, edit & share photos, videos...',
  },
  {
    key: '{provider.instagramV2}',
    text: 'Instagram',
  },
  {
    key: '{provider.linkedin.description}',
    text: 'Manage your professional identity. Build and engage with...',
  },
  {
    key: '{provider.linkedin}',
    text: 'Linkedin',
  },
  {
    key: '{provider.mailchimp.description}',
    text: 'Email marketing, ads, landing pages, and automation tools to...',
  },
  {
    key: '{provider.mailchimp}',
    text: 'Mailchimp',
  },
  {
    key: '{provider.mailgun.description}',
    text: 'Powerful Transactional Email APIs that enable you to send...',
  },
  {
    key: '{provider.mailgun}',
    text: 'Mailgun',
  },
  {
    key: '{provider.mandrill.description}',
    text: 'Mandrill is a transactional email platform from Mailchimp.',
  },
  {
    key: '{provider.mandrill}',
    text: 'Mandrill',
  },
  {
    key: '{provider.mailxpert.description}',
    text: 'Newsletter Software developed in Switzerland for SMEs, agencies and...',
  },
  {
    key: '{provider.mailxpert}',
    text: 'MailXpert',
  },
  {
    key: '{provider.pipedrive.description}',
    text: 'Pipedrive in an easy to use CRM system, focussed on sales management.',
  },
  {
    key: '{provider.pipedrive}',
    text: 'Pipedrive',
  },
  {
    key: '{provider.salesforce.description}',
    text: 'Salesforce CRM is the source of this data.',
  },
  {
    key: '{provider.salesforce}',
    text: 'Salesforce',
  },
  {
    key: '{provider.semrush.description}',
    text: 'SEMrush is a powerful and versatile competitive intelligence suite for...',
  },
  {
    key: '{provider.semrush}',
    text: 'Semrush',
  },
  {
    key: '{provider.twitter.description}',
    text: 'Twitter - competitor data provider',
  },
  {
    key: '{provider.twitter}',
    text: 'Twitter (Competitors)',
  },
  {
    key: '{provider.twitterV2.description}',
    text: 'From breaking news and entertainment to sports and politics, get...',
  },
  {
    key: '{provider.twitterV2}',
    text: 'X',
  },
  {
    key: '{provider.thehouse.description}',
    text: 'Marketing planning system of house',
  },
  {
    key: '{provider.thehouse}',
    text: 'House Agency Planner',
  },
  {
    key: '{provider.weatherstack.description}',
    text: 'Subscribe to various weather data for locations across the globe...',
  },
  {
    key: '{provider.weatherstack}',
    text: 'Weather',
  },
  {
    key: '{provider.youtube.description}',
    text: 'Famous video platform Youtube to get all your video-statistics.',
  },
  {
    key: '{provider.youtube}',
    text: 'Youtube',
  },
  {
    key: '{provider.google.searchconsole}',
    text: 'Google Search Console',
  },
  {
    key: '{provider.pinterest.description}',
    text: 'Image sharing and social media service',
  },
  {
    key: '{provider.pinterest}',
    text: 'Pinterest',
  },
  {
    key: '{provider.customkpi}',
    text: 'Custom KPI',
  },
  {
    key: '{provider.customkpi.description}',
    text: "Custom KPI's with predefined calculations such as min,max,sum or avg.",
  },
  {
    key: '{provider.customimport}',
    text: 'Imported',
  },
  {
    key: '{provider.rtb_house}',
    text: 'RTB House',
  },
  {
    key: '{provider.rtb_house.description}',
    text: 'RTB House',
  },
  {
    key: '{provider.snapchat}',
    text: 'Snapchat',
  },
  {
    key: '{provider.snapchat.description}',
    text: 'Snapchat',
  },
  {
    key: '{provider.customimport.description}',
    text: 'Manual imported KPIs',
  },
  {
    key: '{provider.sap.mc}',
    text: 'SAP Marketing Cloud',
  },
  {
    key: '{provider.sap.mc.description}',
    text: 'SAP Marketing Cloud',
  },
  {
    key: '{provider.salesforce.salescloud}',
    text: 'Salesforce Sales Cloud',
  },
  {
    key: '{provider.salesforce.salescloud.description}',
    text: 'Salesforce Sales Cloud is a customer relationship management (CRM) platform designed to support sales, marketing and customer support.',
  },
  {
    key: '{provider.salesforce.marketingcloud}',
    text: 'Salesforce Marketing Cloud',
  },
  {
    key: '{provider.salesforce.marketingcloud.description}',
    text: 'Salesforce Marketing Cloud is a provider of digital marketing automation and analytics software and services.',
  },
  {
    key: '{provider.gotowebinar.description}',
    text: 'Present to hundreds with confidence and attend a webinar from anywhere.',
  },
  {
    key: '{provider.gotowebinar}',
    text: 'GoToWebinar',
  },
  {
    key: '{provider.googledcm.description}',
    text: 'Google DoubleClick for Advertisers.',
  },
  {
    key: '{provider.googledcm}',
    text: 'Google DCM',
  },
  {
    key: '{provider.googledv360.description}',
    text: 'Google Display & Video for Advertisers.',
  },
  {
    key: '{provider.googledv360}',
    text: 'Google Display & Video',
  },
  {
    key: '{provider.bing.description}',
    text: 'Bing is a web search engine owned and operated by Microsoft.',
  },
  {
    key: '{provider.bing}',
    text: 'Microsoft Bing',
  },
  {
    key: '{provider.taboola.description}',
    text: 'Taboola is a content discovery and native advertising platform.',
  },
  {
    key: '{provider.taboola}',
    text: 'Taboola',
  },
  {
    key: '{provider.siteimprove.description}',
    text: 'Siteimprove is a platform for website optimization.',
  },
  {
    key: '{provider.siteimprove}',
    text: 'Siteimprove',
  },
  {
    key: '{provider.mediamath}',
    text: 'MediaMath',
  },
  {
    key: '{provider.mediamath.description}',
    text: 'The MediaMath Platform empowers brands and agencies to take control of their marketing today and operate with flexibility to deliver efficient and effective omnichannel campaigns into the future.',
  },
  {
    key: '{provider.tiktokV1}',
    text: 'TikTok',
  },
  {
    key: '{provider.tiktokV1.description}',
    text: 'TikTok is a social media platform for creating, sharing and discovering short videos',
  },
  {
    key: '{provider.reddit}',
    text: 'Reddit',
  },
  {
    key: '{provider.reddit.description}',
    text: 'Reddit for advertisement',
  },
  {
    key: '{provider.outbrain}',
    text: 'Outbrain',
  },
  {
    key: '{provider.outbrain.description}',
    text: 'Outbrain is a recommendation platform powered by native ads',
  },
  {
    key: '{provider.outbrain.logoAlt}',
    text: 'Outbrain logo',
  },
  {
    key: '{provider.criteo}',
    text: 'Criteo',
  },
  {
    key: '{provider.criteo.description}',
    text: 'Criteo for advertisement',
  },
  {
    key: '{provider.googlesa360}',
    text: 'Google Search Ads 360',
  },
  {
    key: '{provider.googlesa360.description}',
    text: 'Get the most from your search campaign data. Search Ads 360 helps you respond to an ever-changing market in real time and at scale.',
  },
  {
    key: '{provider.adform}',
    text: 'Adform',
  },
  {
    key: '{provider.adform.description}',
    text: 'Open, connected, and independent, Adform is built for the game changers - surprisingly, in a world of giants, we are the most powerful and safe media buying platform in the world.',
  },
  {
    key: '{provider.awin}',
    text: 'Awin',
  },
  {
    key: '{provider.awin.description}',
    text: 'Awin is a global affiliate marketing network that empowers advertisers and publishers of all sizes to grow their businesses online.',
  },
  {
    key: '{provider.facile}',
    text: 'Facile.it',
  },
  {
    key: '{provider.facile.description}',
    text: 'Facile.it is the leading Italian insurance comparison platform.',
  },
  {
    key: '{provider.hej}',
    text: 'Hej',
  },
  {
    key: '{provider.hej.description}',
    text: 'Hej is a Swedish insurance comparison platform.',
  },
  {
    key: '{provider.horizon}',
    text: 'Horizon',
  },
  {
    key: '{provider.horizon.description}',
    text: 'Horizon is a German insurance comparison platform.',
  },
  {
    key: '{provider.refine_direct}',
    text: 'Refine Direct',
  },
  {
    key: '{provider.refine_direct.description}',
    text: 'Refine Direct is a German insurance comparison platform.',
  },
  {
    key: '{provider.segugio}',
    text: 'Segugio',
  },
  {
    key: '{provider.segugio.description}',
    text: 'Segugio is an Italian insurance comparison platform.',
  },
  {
    key: '{provider.sos_tariffe}',
    text: 'Sos Tariffe',
  },
  {
    key: '{provider.sos_tariffe.description}',
    text: 'Sos Tariffe is an Italian insurance comparison platform.',
  },
  {
    key: '{provider.tradedoubler}',
    text: 'Tradedoubler',
  },
  {
    key: '{provider.tradedoubler.description}',
    text: 'Tradedoubler is an international performance marketing partner.',
  },
  {
    key: '{provider.ringier_network}',
    text: 'Ringier Network',
  },
  {
    key: '{provider.ringier_network.description}',
    text: 'Ringier Network.',
  },
  {
    key: '{provider.theTradeDesk}',
    text: 'TheTradeDesk',
  },
  {
    key: '{provider.theTradeDesk.description}',
    text: 'The omnichannel advertising platform built for the open internet',
  },
];

export const MOCK_AVAILABLE_FIELDS_AND_OPERATIONS = [
  {
    fieldName: 'title',
    operators: ['eq', 'ne', 'contains', 'notContains'],
    allowed: {
      enumOptionsNumber: null,
      enumOptionsString: null,
      fieldType: 'string',
    },
  },
  {
    fieldName: 'contentType',
    operators: ['eq', 'ne'],
    allowed: {
      enumOptionsNumber: null,
      enumOptionsString: [
        'campaign',
        'adset',
        'ad',
        'campaignGroup',
        'campaignStrategy',
        'sharedBudget',
        'sharedBiddingStrategy',
      ],
      fieldType: 'string',
    },
  },
  {
    fieldName: 'parentContentId',
    operators: ['eq', 'ne'],
    allowed: {
      enumOptionsNumber: null,
      enumOptionsString: null,
      fieldType: 'number',
    },
  },
  {
    fieldName: 'parentTitle',
    operators: ['eq', 'ne', 'contains', 'notContains'],
    allowed: {
      enumOptionsNumber: null,
      enumOptionsString: null,
      fieldType: 'string',
    },
  },
  {
    fieldName: 'startDate',
    operators: ['lte', 'gte'],
    allowed: {
      enumOptionsNumber: null,
      enumOptionsString: null,
      fieldType: 'date',
    },
  },
  {
    fieldName: 'endDate',
    operators: ['lte', 'gte'],
    allowed: {
      enumOptionsNumber: null,
      enumOptionsString: null,
      fieldType: 'date',
    },
  },
  {
    fieldName: 'latestMeasurementDataDate',
    operators: ['lte', 'gte'],
    allowed: {
      enumOptionsNumber: null,
      enumOptionsString: null,
      fieldType: 'date',
    },
  },
  {
    fieldName: 'bidStrategy',
    operators: ['eq', 'ne'],
    allowed: {
      enumOptionsNumber: null,
      enumOptionsString: [
        'Fixed bid',
        'Highest volume',
        'Cost per result goal',
        'Bid Cap',
        'Target CPA',
        'Target CPC',
        'Target CPM',
        'Target CPV',
        'Target ROAS',
        'Maximize Views',
        'Maximize clicks',
        'Maximize conversions',
        'Maximize conversion value',
        'Custom algorithm',
        'Target Impression Share',
        'Unkown',
      ],
      fieldType: 'string',
    },
  },
  {
    fieldName: 'status',
    operators: ['eq', 'ne'],
    allowed: {
      enumOptionsNumber: null,
      enumOptionsString: ['ACTIVE', 'PAUSED', 'ARCHIVED', 'WITH_ISSUES', 'DRAFT', 'UNKNOWN', 'INTERNAL_DELETION'],
      fieldType: 'string',
    },
  },
];

export const MOCK_FILTERED_CONTENTS = [
  {
    portfolioContentId: null,
    contentId: 5629421830,
    title: 'south | indigo',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 7,
      name: 'Campaign',
    },
    parent: {
      contentId: 5629421800,
      title: 'south | fuchsia',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629421861,
    title: 'west | sky blue',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 7,
      name: 'Campaign',
    },
    parent: {
      contentId: 5629421800,
      title: 'south | fuchsia',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629421863,
    title: 'east | maroon',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 7,
      name: 'Campaign',
    },
    parent: {
      contentId: 5629421803,
      title: 'west | ivory',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629421894,
    title: 'west | olive',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 7,
      name: 'Campaign',
    },
    parent: {
      contentId: 5629421803,
      title: 'west | ivory',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629421896,
    title: 'north-east | silver',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 7,
      name: 'Campaign',
    },
    parent: {
      contentId: 5629421806,
      title: 'east | gold',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629421927,
    title: 'west | mint green',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 7,
      name: 'Campaign',
    },
    parent: {
      contentId: 5629421806,
      title: 'east | gold',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629421929,
    title: 'south | indigo',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 7,
      name: 'Campaign',
    },
    parent: {
      contentId: 5629421809,
      title: 'south | fuchsia',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629421960,
    title: 'west | sky blue',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 7,
      name: 'Campaign',
    },
    parent: {
      contentId: 5629421809,
      title: 'south | fuchsia',
    },
  },
  {
    portfolioContentId: 1485643,
    contentId: 5629422050,
    title: 'east | maroon',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 7,
      name: 'Campaign',
    },
    parent: {
      contentId: 5629421820,
      title: 'west | ivory',
    },
  },
  {
    portfolioContentId: 1485674,
    contentId: 5629422081,
    title: 'west | olive',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 7,
      name: 'Campaign',
    },
    parent: {
      contentId: 5629421820,
      title: 'west | ivory',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629422087,
    title: 'west | maroon',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 7,
      name: 'Campaign',
    },
    parent: {
      contentId: 5629421827,
      title: 'north | sky blue',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629422088,
    title: 'north | orange',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 7,
      name: 'Campaign',
    },
    parent: {
      contentId: 5629421827,
      title: 'north | sky blue',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629422089,
    title: 'west | azure',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 7,
      name: 'Campaign',
    },
    parent: {
      contentId: 5629421827,
      title: 'north | sky blue',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629422090,
    title: 'west | pink',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 7,
      name: 'Campaign',
    },
    parent: {
      contentId: 5629421827,
      title: 'north | sky blue',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629422091,
    title: 'north | sky blue',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 7,
      name: 'Campaign',
    },
    parent: {
      contentId: 5629421827,
      title: 'north | sky blue',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629422092,
    title: 'south-east | lime',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 7,
      name: 'Campaign',
    },
    parent: {
      contentId: 5629421827,
      title: 'north | sky blue',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629422093,
    title: 'north-west | plum',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 7,
      name: 'Campaign',
    },
    parent: {
      contentId: 5629421827,
      title: 'north | sky blue',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629422094,
    title: 'east | sky blue',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 7,
      name: 'Campaign',
    },
    parent: {
      contentId: 5629421828,
      title: 'north | olive',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629422095,
    title: 'south | ivory',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 7,
      name: 'Campaign',
    },
    parent: {
      contentId: 5629421828,
      title: 'north | olive',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629422096,
    title: 'south-west | maroon',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 7,
      name: 'Campaign',
    },
    parent: {
      contentId: 5629421828,
      title: 'north | olive',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629422097,
    title: 'north-east | grey',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 7,
      name: 'Campaign',
    },
    parent: {
      contentId: 5629421828,
      title: 'north | olive',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629422333,
    title: 'north | black',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 8,
      name: 'Ad-set',
    },
    parent: {
      contentId: 5629422087,
      title: 'west | maroon',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629422334,
    title: 'south-west | silver',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 8,
      name: 'Ad-set',
    },
    parent: {
      contentId: 5629422088,
      title: 'north | orange',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629422338,
    title: 'north-west | lime',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 8,
      name: 'Ad-set',
    },
    parent: {
      contentId: 5629422088,
      title: 'north | orange',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629422339,
    title: 'west | ivory',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 8,
      name: 'Ad-set',
    },
    parent: {
      contentId: 5629422089,
      title: 'west | azure',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629422340,
    title: 'north-west | orchid',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 8,
      name: 'Ad-set',
    },
    parent: {
      contentId: 5629422089,
      title: 'west | azure',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629422341,
    title: 'west | violet',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 8,
      name: 'Ad-set',
    },
    parent: {
      contentId: 5629422089,
      title: 'west | azure',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629422342,
    title: 'north-west | turquoise',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 8,
      name: 'Ad-set',
    },
    parent: {
      contentId: 5629422089,
      title: 'west | azure',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629422343,
    title: 'north-west | salmon',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 8,
      name: 'Ad-set',
    },
    parent: {
      contentId: 5629422090,
      title: 'west | pink',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629422344,
    title: 'south-west | orchid',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 8,
      name: 'Ad-set',
    },
    parent: {
      contentId: 5629422091,
      title: 'north | sky blue',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629422345,
    title: 'east | pink',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 8,
      name: 'Ad-set',
    },
    parent: {
      contentId: 5629422092,
      title: 'south-east | lime',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629422353,
    title: 'north-east | magenta',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 8,
      name: 'Ad-set',
    },
    parent: {
      contentId: 5629422094,
      title: 'east | sky blue',
    },
  },
  {
    portfolioContentId: null,
    contentId: 5629422354,
    title: 'north-east | orange',
    latestMeasurementDataDate: null,
    startDatetime: null,
    endDatetime: null,
    biddingStrategy: null,
    budget: null,
    status: null,
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
    contentType: {
      collection_type_id: 8,
      name: 'Ad-set',
    },
    parent: {
      contentId: 5629422097,
      title: 'north-east | grey',
    },
  },
];

export const MOCK_PROVIDER_SUB_ACCOUNTS = [
  {
    contentId: 5629421802,
    title: 'north | blue',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 35,
      name: '{provider.bing}',
    },
  },
  {
    contentId: 5629421805,
    title: 'north | violet',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 35,
      name: '{provider.bing}',
    },
  },
  {
    contentId: 5629421808,
    title: 'south | purple',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 35,
      name: '{provider.bing}',
    },
  },
  {
    contentId: 5629421811,
    title: 'north | blue',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 35,
      name: '{provider.bing}',
    },
  },
  {
    contentId: 5629421822,
    title: 'north | violet',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 35,
      name: '{provider.bing}',
    },
  },
  {
    contentId: 5629421800,
    title: 'south | fuchsia',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
  },
  {
    contentId: 5629421803,
    title: 'west | ivory',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
  },
  {
    contentId: 5629421806,
    title: 'east | gold',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
  },
  {
    contentId: 5629421809,
    title: 'south | fuchsia',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
  },
  {
    contentId: 5629421820,
    title: 'west | ivory',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
  },
  {
    contentId: 5629421827,
    title: 'north | sky blue',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
  },
  {
    contentId: 5629421828,
    title: 'north | olive',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
  },
  {
    contentId: 5629421801,
    title: 'west | ivory',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 24,
      name: '{provider.google.ads}',
    },
  },
  {
    contentId: 5629421804,
    title: 'south-west | turquoise',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 24,
      name: '{provider.google.ads}',
    },
  },
  {
    contentId: 5629421807,
    title: 'north-west | purple',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 24,
      name: '{provider.google.ads}',
    },
  },
  {
    contentId: 5629421810,
    title: 'west | ivory',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 24,
      name: '{provider.google.ads}',
    },
  },
  {
    contentId: 5629421812,
    title: 'south | olive',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 24,
      name: '{provider.google.ads}',
    },
  },
  {
    contentId: 5629421813,
    title: 'north-east | salmon',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 24,
      name: '{provider.google.ads}',
    },
  },
  {
    contentId: 5629421814,
    title: 'north-east | blue',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 24,
      name: '{provider.google.ads}',
    },
  },
  {
    contentId: 5629421815,
    title: 'north-west | fuchsia',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 24,
      name: '{provider.google.ads}',
    },
  },
  {
    contentId: 5629421821,
    title: 'south-west | turquoise',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 24,
      name: '{provider.google.ads}',
    },
  },
];

export const MOCK_FUNNEL_STEPS = [
  {
    funnelStepId: 116031,
    title: 'COST',
    type: NexoyaFunnelStepType.Cost,
    isCalibrated: false,
  },
  {
    funnelStepId: 116032,
    title: 'IMPRESSIONS',
    type: NexoyaFunnelStepType.Awareness,
    isCalibrated: false,
  },
  {
    funnelStepId: 116033,
    title: 'Sessions',
    type: NexoyaFunnelStepType.Consideration,
    isCalibrated: false,
  },
  {
    funnelStepId: 116034,
    title: 'Add To Cart',
    type: NexoyaFunnelStepType.Consideration,
    isCalibrated: false,
  },
  {
    funnelStepId: 116035,
    title: 'Conversion',
    type: NexoyaFunnelStepType.Conversion,
    isCalibrated: false,
  },
  {
    funnelStepId: 116037,
    title: 'Revenue',
    type: NexoyaFunnelStepType.ConversionValue,
    isCalibrated: false,
  },
  {
    funnelStepId: 116036,
    title: 'Margin/Profit',
    type: NexoyaFunnelStepType.ConversionValue,
    isCalibrated: false,
  },
];
