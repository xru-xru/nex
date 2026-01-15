import { LABELS_QUERY } from '../../src/graphql/labels/queryLabels';
import { TEAM_QUERY } from '../../src/graphql/team/queryTeam';
import { TRANSLATIONS_QUERY } from '../../src/graphql/translation/queryTranslations';

export const labelsQueryMock = {
  request: {
    query: LABELS_QUERY,
    variables: {
      teamId: null,
      portfolioId: null,
    },
  },
  result: {
    data: {
      labels: [
        {
          labels: [
            {
              value: 40,
              funnelStepId: 6340,
            },
            {
              value: 0,
              funnelStepId: 6339,
            },
            {
              value: 55,
              funnelStepId: 6342,
            },
            {
              value: 5,
              funnelStepId: 6341,
            },
            {
              value: 0,
              funnelStepId: 6343,
            },
          ],
          labelId: 672,
          name: 'Display',
        },
        {
          labels: [
            {
              value: 40,
              funnelStepId: 6340,
            },
            {
              value: 0,
              funnelStepId: 6339,
            },
            {
              value: 55,
              funnelStepId: 6342,
            },
            {
              value: 5,
              funnelStepId: 6341,
            },
            {
              value: 0,
              funnelStepId: 6343,
            },
          ],
          labelId: 673,
          name: 'FB Conversion',
        },
        {
          labels: [
            {
              value: 30,
              funnelStepId: 6340,
            },
            {
              value: 60,
              funnelStepId: 6339,
            },
            {
              value: 10,
              funnelStepId: 6342,
            },
            {
              value: 0,
              funnelStepId: 6341,
            },
            {
              value: 0,
              funnelStepId: 6343,
            },
          ],
          labelId: 674,
          name: 'FB Video',
        },
        {
          labels: [
            {
              value: 10,
              funnelStepId: 6340,
            },
            {
              value: 0,
              funnelStepId: 6339,
            },
            {
              value: 30,
              funnelStepId: 6342,
            },
            {
              value: 50,
              funnelStepId: 6341,
            },
            {
              value: 10,
              funnelStepId: 6343,
            },
          ],
          labelId: 675,
          name: 'GDN Remarketing',
        },
        {
          labels: [
            {
              value: 0,
              funnelStepId: 6340,
            },
            {
              value: 0,
              funnelStepId: 6339,
            },
            {
              value: 0,
              funnelStepId: 6342,
            },
            {
              value: 10,
              funnelStepId: 6341,
            },
            {
              value: 90,
              funnelStepId: 6343,
            },
          ],
          labelId: 676,
          name: 'PLA',
        },
        {
          labels: [
            {
              value: 0,
              funnelStepId: 6340,
            },
            {
              value: 0,
              funnelStepId: 6339,
            },
            {
              value: 0,
              funnelStepId: 6342,
            },
            {
              value: 10,
              funnelStepId: 6341,
            },
            {
              value: 90,
              funnelStepId: 6343,
            },
          ],
          labelId: 677,
          name: 'SEA',
        },
        {
          labels: [
            {
              value: 0,
              funnelStepId: 6340,
            },
            {
              value: 0,
              funnelStepId: 6339,
            },
            {
              value: 0,
              funnelStepId: 6342,
            },
            {
              value: 10,
              funnelStepId: 6341,
            },
            {
              value: 90,
              funnelStepId: 6343,
            },
          ],
          labelId: 678,
          name: 'SEA Non-Brand only',
        },
        {
          labels: [
            {
              value: 20,
              funnelStepId: 6340,
            },
            {
              value: 60,
              funnelStepId: 6339,
            },
            {
              value: 20,
              funnelStepId: 6342,
            },
            {
              value: 0,
              funnelStepId: 6341,
            },
            {
              value: 0,
              funnelStepId: 6343,
            },
          ],
          labelId: 679,
          name: 'YouTube',
        },
      ],
    },
  },
};

export const translationQueryMock = {
  request: {
    query: TRANSLATIONS_QUERY,
    variables: {
      lang: 'en_us',
    },
  },
  result: {
    data: [
      {
        key: '{datatype:currency.description}',
        text: 'Dollar',
      },
      {
        key: '{datatype:currency.label}',
        text: '$',
      },
      {
        key: '{datatype:currency.usd.description}',
        text: 'Dollar',
      },
      {
        key: '{datatype:currency.usd.label}',
        text: '$',
      },
      {
        key: '{datatype:integer}',
        text: '',
      },
      {
        key: '{datatype:percentage}',
        text: '%',
      },
      {
        key: '{datatype:celsius}',
        text: '°',
      },
      {
        key: '{datatype:kilometersperhour}',
        text: 'km/h',
      },
      {
        key: '{datatype:millimeter}',
        text: 'mm',
      },
      {
        key: '{datatype:centimeter}',
        text: 'cm',
      },
      {
        key: '{datatype:hour}',
        text: 'h',
      },
      {
        key: '{datatype:ratio}',
        text: '',
      },
      {
        key: '{industry:finance}',
        text: 'Finance',
      },
      {
        key: '{industry:industrial}',
        text: 'Industrial',
      },
      {
        key: '{industry:it}',
        text: 'IT',
      },
      {
        key: '{industry:retail}',
        text: 'Retail',
      },
      {
        key: '{kpi:adition.clickrate}',
        text: 'CTR',
      },
      {
        key: '{kpi:adition.clicks_price}',
        text: 'CPC',
      },
      {
        key: '{kpi:adition.clicks}',
        text: 'Clicks',
      },
      {
        key: '{kpi:adition.price}',
        text: 'Price',
      },
      {
        key: '{kpi:adition.views_price}',
        text: 'CPM',
      },
      {
        key: '{kpi:adition.views}',
        text: 'Ad Imps Actual',
      },
      {
        key: '{kpi:adition.visibility}',
        text: 'Visibility',
      },
      {
        key: '{kpi:adunittech.clicks.description}',
        text: 'Clicks',
      },
      {
        key: '{kpi:adunittech.clicks}',
        text: 'Clicks',
      },
      {
        key: '{kpi:adunittech.conversions.description}',
        text: 'Conversions',
      },
      {
        key: '{kpi:adunittech.conversions}',
        text: 'Conversions',
      },
      {
        key: '{kpi:adunittech.ctr}',
        text: 'Click-through Rate',
      },
      {
        key: '{kpi:adunittech.ecpa.description}',
        text: 'Effective Cost per acquisition (CPA), i.e. cost per conversion',
      },
      {
        key: '{kpi:adunittech.ecpa}',
        text: 'Effective Cost per acquisition (CPA), i.e. cost per conversion',
      },
      {
        key: '{kpi:adunittech.ecpc.description}',
        text: 'Effective Cost per Click',
      },
      {
        key: '{kpi:adunittech.ecpc}',
        text: 'Effective Cost per Click',
      },
      {
        key: '{kpi:adunittech.ecpm.description}',
        text: 'Effective cost per thousand impressions (technically, "effective cost per mille").',
      },
      {
        key: '{kpi:adunittech.ecpm}',
        text: 'Effective cost per thousand impressions (technically, "effective cost per mille").',
      },
      {
        key: '{kpi:adunittech.impressions.ctr}',
        text: 'Click-through Rate',
      },
      {
        key: '{kpi:adunittech.impressions.description}',
        text: 'Impressions',
      },
      {
        key: '{kpi:adunittech.impressions}',
        text: 'Impressions',
      },
      {
        key: '{kpi:adunittech.totalSpend.description}',
        text: 'Total Spend',
      },
      {
        key: '{kpi:adunittech.totalSpend}',
        text: 'Total Spend',
      },
      {
        key: '{kpi:appstore.activeDevices.description}',
        text: 'Active Devices',
      },
      {
        key: '{kpi:appstore.activeDevices}',
        text: 'Active Devices',
      },
      {
        key: '{kpi:appstore.crashes.description}',
        text: 'Crashes',
      },
      {
        key: '{kpi:appstore.crashes}',
        text: 'Crashes',
      },
      {
        key: '{kpi:appstore.iap.description}',
        text: 'In-App Purchases',
      },
      {
        key: '{kpi:appstore.iap}',
        text: 'In-App Purchases',
      },
      {
        key: '{kpi:appstore.impressions.description}',
        text: 'Impressions',
      },
      {
        key: '{kpi:appstore.impressions}',
        text: 'Impressions',
      },
      {
        key: '{kpi:appstore.impressionsUnique.description}',
        text: 'Unique Impressions/Reach',
      },
      {
        key: '{kpi:appstore.impressionsUnique}',
        text: 'Unique Impressions/Reach',
      },
      {
        key: '{kpi:appstore.installs.description}',
        text: 'Installs',
      },
      {
        key: '{kpi:appstore.installs}',
        text: 'Installs',
      },
      {
        key: '{kpi:appstore.pageViews.description}',
        text: 'Page Views',
      },
      {
        key: '{kpi:appstore.pageViews}',
        text: 'Page Views',
      },
      {
        key: '{kpi:appstore.payingUsers.description}',
        text: 'Paying Users',
      },
      {
        key: '{kpi:appstore.payingUsers}',
        text: 'Paying Users',
      },
      {
        key: '{kpi:appstore.reviews}',
        text: 'Reviews',
      },
      {
        key: '{kpi:appstore.sales.description}',
        text: 'Sales',
      },
      {
        key: '{kpi:appstore.sales}',
        text: 'Sales',
      },
      {
        key: '{kpi:appstore.score.description}',
        text: 'Score',
      },
      {
        key: '{kpi:appstore.score}',
        text: 'Score',
      },
      {
        key: '{kpi:appstore.sessions.description}',
        text: 'Sessions',
      },
      {
        key: '{kpi:appstore.sessions}',
        text: 'Sessions',
      },
      {
        key: '{kpi:appstore.units.description}',
        text: 'Unit Sales',
      },
      {
        key: '{kpi:appstore.units}',
        text: 'Unit Sales',
      },
      {
        key: '{kpi:blogs.entrances.description}',
        text: '',
      },
      {
        key: '{kpi:blogs.entrances}',
        text: 'Entrances',
      },
      {
        key: '{kpi:blogs.exists.description}',
        text: '',
      },
      {
        key: '{kpi:blogs.exists}',
        text: 'Exits',
      },
      {
        key: '{kpi:blogs.exitsPerPageview.description}',
        text: '',
      },
      {
        key: '{kpi:blogs.exitsPerPageview}',
        text: 'Exits per Pageview',
      },
      {
        key: '{kpi:domain.contacts.description}',
        text: '',
      },
      {
        key: '{kpi:domain.contacts}',
        text: 'Contacts',
      },
      {
        key: '{kpi:domain.leads.description}',
        text: '',
      },
      {
        key: '{kpi:domain.leads}',
        text: 'Leads',
      },
      {
        key: '{kpi:facebook.actions.description}',
        text: 'Actions/Conversions',
      },
      {
        key: '{kpi:facebook.actions}',
        text: 'Actions/Conversions',
      },
      {
        key: '{kpi:facebook.clicks.description}',
        text: 'Total Clicks',
      },
      {
        key: '{kpi:facebook.clicks}',
        text: 'Clicks',
      },
      {
        key: '{kpi:facebook.cpc.description}',
        text: 'Total Cost per Click',
      },
      {
        key: '{kpi:facebook.cpc}',
        text: 'Cost per Click',
      },
      {
        key: '{kpi:facebook.cpm.description}',
        text: 'Cost per Thousand - Impression',
      },
      {
        key: '{kpi:facebook.cpm}',
        text: 'Cost per Thousand - Impression',
      },
      {
        key: '{kpi:facebook.ctr.description}',
        text: 'Click-through Rate',
      },
      {
        key: '{kpi:facebook.ctr}',
        text: 'Click-through Rate',
      },
      {
        key: '{kpi:facebook.impressions.description}',
        text: 'Total Impressions',
      },
      {
        key: '{kpi:facebook.impressions}',
        text: 'Impressions',
      },
      {
        key: '{kpi:facebook.spend.description}',
        text: 'Total Ad Costs / Spendings in respective currency',
      },
      {
        key: '{kpi:facebook.spend}',
        text: 'Ad Costs / Spendings',
      },
      {
        key: '{kpi:forms.following.description}',
        text: '',
      },
      {
        key: '{kpi:forms.interactions.description}',
        text: '',
      },
      {
        key: '{kpi:forms.interactions}',
        text: 'Interactions',
      },
      {
        key: '{kpi:forms.likes.description}',
        text: '',
      },
      {
        key: '{kpi:forms.submissions.description}',
        text: '',
      },
      {
        key: '{kpi:forms.submissions}',
        text: 'Submissions',
      },
      {
        key: '{kpi:forms.tweets.description}',
        text: '',
      },
      {
        key: '{kpi:gplay.charge_amount.description}',
        text: 'Charges Total',
      },
      {
        key: '{kpi:gplay.charge_amount}',
        text: 'Charges Total',
      },
      {
        key: '{kpi:gplay.daily_average_rating.description}',
        text: 'Daily Avg. Raiting',
      },
      {
        key: '{kpi:gplay.daily_average_rating}',
        text: 'Daily Avg. Raiting',
      },
      {
        key: '{kpi:gplay.daily_user_installs.description}',
        text: 'Daily User Installations',
      },
      {
        key: '{kpi:gplay.daily_user_installs}',
        text: 'Daily User Installations',
      },
      {
        key: '{kpi:gplay.ratings.description}',
        text: 'Ratings',
      },
      {
        key: '{kpi:gplay.ratings}',
        text: 'Ratings',
      },
      {
        key: '{kpi:gplay.refund_amount.description}',
        text: 'Refunds Total',
      },
      {
        key: '{kpi:gplay.refund_amount}',
        text: 'Refunds Total',
      },
      {
        key: '{kpi:gplay.reviews_star_rating.description}',
        text: 'Reviews',
      },
      {
        key: '{kpi:gplay.reviews_star_rating}',
        text: 'Reviews',
      },
      {
        key: '{kpi:gplay.reviews.description}',
        text: 'Reviews',
      },
      {
        key: '{kpi:gplay.reviews}',
        text: 'Reviews',
      },
      {
        key: '{kpi:gplay.sales_charged.description}',
        text: 'Sales',
      },
      {
        key: '{kpi:gplay.sales_charged}',
        text: 'Sales',
      },
      {
        key: '{kpi:gplay.sales_refund.description}',
        text: 'Sales - Refunds',
      },
      {
        key: '{kpi:gplay.sales_refund}',
        text: 'Sales - Refunds',
      },
      {
        key: '{kpi:gplay.score.description}',
        text: 'Score',
      },
      {
        key: '{kpi:gplay.score}',
        text: 'Score',
      },
      {
        key: '{kpi:growth.description}',
        text: 'Amount of % of growth of your XXXX in a certain timespan.',
      },
      {
        key: '{kpi:growth}',
        text: 'Growth',
      },
      {
        key: '{kpi:hubspot.broadcasts.clicks.description}',
        text: 'Clicks',
      },
      {
        key: '{kpi:hubspot.broadcasts.clicks}',
        text: 'Clicks',
      },
      {
        key: '{kpi:hubspot.broadcasts.contacts.description}',
        text: 'Contacts',
      },
      {
        key: '{kpi:hubspot.broadcasts.contacts}',
        text: 'Contacts',
      },
      {
        key: '{kpi:hubspot.broadcasts.contactsPerPageview.description}',
        text: 'Contacts per Pageview',
      },
      {
        key: '{kpi:hubspot.broadcasts.contactsPerPageview}',
        text: 'Contacts per Pageview',
      },
      {
        key: '{kpi:hubspot.broadcasts.contactToCustomerRate.description}',
        text: 'Contract-to-Customer Rate',
      },
      {
        key: '{kpi:hubspot.broadcasts.contactToCustomerRate}',
        text: 'Contract-to-Customer Rate',
      },
      {
        key: '{kpi:hubspot.broadcasts.customers.description}',
        text: 'Customers',
      },
      {
        key: '{kpi:hubspot.broadcasts.customers}',
        text: 'Customers',
      },
      {
        key: '{kpi:hubspot.broadcasts.customersPerPageview.description}',
        text: 'Customers per Pageview',
      },
      {
        key: '{kpi:hubspot.broadcasts.customersPerPageview}',
        text: 'Customers per Pageview',
      },
      {
        key: '{kpi:hubspot.broadcasts.interactionsCount.description}',
        text: 'Interactions',
      },
      {
        key: '{kpi:hubspot.broadcasts.interactionsCount}',
        text: 'Interactions',
      },
      {
        key: '{kpi:hubspot.broadcasts.leads.description}',
        text: 'Leads',
      },
      {
        key: '{kpi:hubspot.broadcasts.leads}',
        text: 'Leads',
      },
      {
        key: '{kpi:hubspot.broadcasts.likes.description}',
        text: 'Likes',
      },
      {
        key: '{kpi:hubspot.broadcasts.likes}',
        text: 'Likes',
      },
      {
        key: '{kpi:hubspot.broadcasts.opportunities.description}',
        text: 'Opportunities',
      },
      {
        key: '{kpi:hubspot.broadcasts.opportunities}',
        text: 'Opportunities',
      },
      {
        key: '{kpi:hubspot.broadcasts.rawViews.description}',
        text: 'Views',
      },
      {
        key: '{kpi:hubspot.broadcasts.rawViews}',
        text: 'Views',
      },
      {
        key: '{kpi:hubspot.broadcasts.replies.description}',
        text: 'Replies',
      },
      {
        key: '{kpi:hubspot.broadcasts.replies}',
        text: 'Replies',
      },
      {
        key: '{kpi:hubspot.broadcasts.retweets.description}',
        text: 'Retweets',
      },
      {
        key: '{kpi:hubspot.broadcasts.retweets}',
        text: 'Retweets',
      },
      {
        key: '{kpi:instagram.followers.description}',
        text: '',
      },
      {
        key: '{kpi:instagram.followers}',
        text: 'Followers',
      },
      {
        key: '{kpi:instagram.following.description}',
        text: '',
      },
      {
        key: '{kpi:instagram.following}',
        text: 'Following',
      },
      {
        key: '{kpi:instagram.posts.description}',
        text: '',
      },
      {
        key: '{kpi:instagram.posts}',
        text: 'Posts',
      },
      {
        key: '{kpi:linkedin.ads.clicks}',
        text: 'Ad Clicks',
      },
      {
        key: '{kpi:linkedin.ads.comments}',
        text: 'Ad Comments',
      },
      {
        key: '{kpi:linkedin.ads.companyPageClicks}',
        text: 'Ad company page clicks',
      },
      {
        key: '{kpi:linkedin.ads.costInUsd}',
        text: 'Ad Costs (USD)',
      },
      {
        key: '{kpi:linkedin.ads.follows}',
        text: 'Ad Followers',
      },
      {
        key: '{kpi:linkedin.ads.fullScreenPlays}',
        text: 'Ad Full-screen Plays',
      },
      {
        key: '{kpi:linkedin.ads.impressions}',
        text: 'Ad Impressions',
      },
      {
        key: '{kpi:linkedin.ads.likes}',
        text: 'Ad Likes',
      },
      {
        key: '{kpi:linkedin.ads.opens}',
        text: 'Ad Opens Total',
      },
      {
        key: '{kpi:linkedin.ads.totalEngagements}',
        text: 'Ad Total Engagements',
      },
      {
        key: '{kpi:linkedin.ads.videoViews}',
        text: 'Ad Total Video Views',
      },
      {
        key: '{kpi:linkedin.organicFollowerGain}',
        text: 'Organic Followers',
      },
      {
        key: '{kpi:linkedin.pageViews}',
        text: 'Page Views',
      },
      {
        key: '{kpi:linkedin.paidFollowerGain}',
        text: 'Paid Followers',
      },
      {
        key: '{kpi:linkedin.uniquePageViews}',
        text: 'Unique Page Views',
      },
      {
        key: '{kpi:mail.abuse_reports}',
        text: 'Abuse reported',
      },
      {
        key: '{kpi:mail.bounceRate.description}',
        text: '',
      },
      {
        key: '{kpi:mail.bounceRate}',
        text: 'Bounce Rate',
      },
      {
        key: '{kpi:mail.bounces.hard_bounces}',
        text: 'Hard Bounces',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.bounces.soft_bounces}',
        text: 'Soft Bounces',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.clicks.click_rate}',
        text: 'Click Rate',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.clicks.clicks_total}',
        text: 'Total Clicks',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.clicks.unique_clicks}',
        text: 'Unique Clicks',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.clicks.unique_subscriber_clicks}',
        text: 'Unsubscribe Clicks',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.emails_sent.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.emails_sent}',
        text: 'Sent emails',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.forwards.forwards_count}',
        text: 'Forwards Count',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.forwards.forwards_opens}',
        text: 'Forwards Open',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.industry_stats.abuse_rate.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.industry_stats.abuse_rate}',
        text: 'Abuse Rate (your Industry)',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.industry_stats.bounce_rate.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.industry_stats.bounce_rate}',
        text: 'Bounce Rate (your Industry)',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.industry_stats.click_rate.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.industry_stats.click_rate}',
        text: 'Click Rate (your Industry)',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.industry_stats.open_rate.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.industry_stats.open_rate}',
        text: 'Open Rate (your Industry)',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.industry_stats.unopen_rate.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.industry_stats.unopen_rate}',
        text: 'Unopen Rate (your Industry)',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.industry_stats.unsub_rate.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.industry_stats.unsub_rate}',
        text: 'Unsubscribed Rate (your Industry)',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.opens.open_rate}',
        text: 'Open Rate',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.opens.opens_total.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.opens.opens_total}',
        text: 'Total Opens',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.opens.opens_total}\t',
        text: 'Total Opens',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.opens.unique_opens}',
        text: 'Unique Opens',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.subscribers.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.subscribers}',
        text: 'Subscribers',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mail.unsubscribed}',
        text: 'Unsubscribed',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mailgun.accepted.description}',
        text: 'Accepted Mails',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mailgun.accepted}',
        text: 'Accepted Mails',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mailgun.clicked.description}',
        text: 'Clicked',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mailgun.clicked}',
        text: 'Clicked',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mailgun.complained.description}',
        text: 'Complained',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mailgun.complained}',
        text: 'Complained',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mailgun.delivered.description}',
        text: 'Delivered Mails',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mailgun.delivered}',
        text: 'Delivered Mails',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mailgun.failed_permanent.description}',
        text: 'Failed Delivery (permanent)',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mailgun.failed_permanent}',
        text: 'Failed Delivery (permanent)',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mailgun.failed_temporary.description}',
        text: 'Failed Delivery (temporary)',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mailgun.failed_temporary}',
        text: 'Failed Delivery (temporary)',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mailgun.opened.description}',
        text: 'Opened',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mailgun.opened}',
        text: 'Opened',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mailgun.stored.description}',
        text: 'Stored',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mailgun.stored}',
        text: 'Stored',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mailgun.unsubscribed.description}',
        text: 'Unsubscribed',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mailgun.unsubscribed}',
        text: 'Unsubscribed',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mandrill.clicks.description}',
        text: 'Clicks',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mandrill.clicks}',
        text: 'Clicks',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mandrill.complaints.description}',
        text: 'Complaints',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mandrill.complaints}',
        text: 'Complaints',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mandrill.hard_bounces.description}',
        text: 'Hard Bounces',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mandrill.hard_bounces}',
        text: 'Hard Bounces',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mandrill.opens.description}',
        text: 'Opens Total',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mandrill.opens}',
        text: 'Opens Total',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mandrill.rejects.description}',
        text: 'Rejects',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mandrill.rejects}',
        text: 'Rejects',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mandrill.reputation.description}',
        text: 'Reputation',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mandrill.reputation}',
        text: 'Reputation',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mandrill.sent_total.description}',
        text: 'Sent Total',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mandrill.sent_total}',
        text: 'Sent Total',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mandrill.soft_bounces.description}',
        text: 'Soft Bounces',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mandrill.soft_bounces}',
        text: 'Soft Bounces',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mandrill.unique_clicks.description}',
        text: 'Unique Clicks',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mandrill.unique_clicks}',
        text: 'Unique Clicks',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mandrill.unique_opens.description}',
        text: 'Unique Opens',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mandrill.unique_opens}',
        text: 'Unique Opens',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mandrill.unsubs.description}',
        text: 'Unsubscribed',
        __typename: 'Translation',
      },
      {
        key: '{kpi:mandrill.unsubs}',
        text: 'Unsubscribed',
        __typename: 'Translation',
      },
      {
        key: '{kpi:revenue.description}',
        text: 'Amount of revenue in a certain timeframe. Usually in your local currency (i.e. $)',
        __typename: 'Translation',
      },
      {
        key: '{kpi:revenue}',
        text: 'Revenue',
        __typename: 'Translation',
      },
      {
        key: '{kpi:sem.domain.keywords_top_100_google.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:sem.domain.keywords_top_100_google}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:sem.domain.organic_keywords.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:sem.domain.organic_keywords}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:sem.domain.organic_traffic.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:sem.domain.organic_traffic}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:sem.domain.rank.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:sem.domain.rank}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:sem.domain.total_keywords.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:sem.domain.total_keywords}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:sem.domain.visibility.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:sem.domain.visibility}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:sem.keyword.number_of_results.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:sem.keyword.number_of_results}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:sem.keyword.position.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:sem.keyword.position}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:sem.keyword.search_volume.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:sem.keyword.search_volume}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:sem.keyword.traffic_percent.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:sem.keyword.traffic_percent}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:twitter.followers.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:twitter.followers}',
        text: 'Followers',
        __typename: 'Translation',
      },
      {
        key: '{kpi:twitter.following.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:twitter.following}',
        text: 'Following',
        __typename: 'Translation',
      },
      {
        key: '{kpi:twitter.likes.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:twitter.likes}',
        text: 'Likes',
        __typename: 'Translation',
      },
      {
        key: '{kpi:twitter.tweets.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:twitter.tweets}',
        text: 'Tweets',
        __typename: 'Translation',
      },
      {
        key: '{kpi:visitors.description}',
        text: 'Amount of visitors on your website in a certain amount of time.',
        __typename: 'Translation',
      },
      {
        key: '{kpi:visitors}',
        text: 'Visitors',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.adClicks.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.adClicks}',
        text: 'Ad Clicks',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.adCost.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.adCost}',
        text: 'Ad Costs',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.avgPageLoadTime.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.avgPageLoadTime}',
        text: 'Avg. Page Load time',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.avgSessionDuration.avgSessionDuration}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.avgSessionDuration}',
        text: 'Avg. Session Duration',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.backlinks.ascore.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.backlinks.ascore}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.backlinks.domains_num.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.backlinks.domains_num}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.backlinks.follows_num.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.backlinks.follows_num}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.backlinks.nofollows_num.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.backlinks.nofollows_num}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.backlinks.score.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.backlinks.score}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.backlinks.total.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.backlinks.total}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.bounce_rate.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.bounce_rate}',
        text: 'Bounce Rate',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.bounces.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.bounces}',
        text: 'Bounces',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.CPC.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.CPC}',
        text: 'Cost per Click',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.CPM.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.CPM}',
        text: 'Cost per Impression',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.CTR.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.CTR}',
        text: 'Click-through Rate',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.goalCompletions}',
        text: 'Goal Completions',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.goalValue}',
        text: 'Goal Value',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.impressions.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.impressions}',
        text: 'Impressions',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.newUsers.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.newUsers}',
        text: 'New Users',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.organicSearches.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.organicSearches}',
        text: 'Organic Searches',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.percentNewSessions.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.percentNewSessions}',
        text: '% new Sessions',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.RPC.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.RPC}',
        text: 'Revenue per Click',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.sessionDuration.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.sessionDuration}',
        text: 'Session Duration',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.sessions.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.sessions}',
        text: 'Sessions',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.sessionsPerUser.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.sessionsPerUser}',
        text: 'Sessions per User',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.sessiontocontactrate.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.sessiontocontactrate}',
        text: 'Session to Contract Rate',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.users.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.users}',
        text: 'Users',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.viewpersession.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{kpi:website.viewpersession}',
        text: 'View per Session',
        __typename: 'Translation',
      },
      {
        key: '{linkedin:campaign}',
        text: 'Campaign',
        __typename: 'Translation',
      },
      {
        key: '{linkedin:page}',
        text: 'Page',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adition.clickrate.description}',
        text: 'Click-through Rate in %',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adition.clickrate}',
        text: 'CTR Actual',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adition.clicks_price.description}',
        text: 'Cost per click',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adition.clicks_price}',
        text: 'CPC Actual',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adition.clicks.description}',
        text: 'Amount of clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adition.clicks}',
        text: 'Clicks (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adition.price.description}',
        text: 'Price in a given time',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adition.price}',
        text: 'Price (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adition.views_price.description}',
        text: 'Cost per thousand impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adition.views_price}',
        text: 'CPM Actual',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adition.views.description}',
        text: 'Number of impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adition.views}',
        text: 'Ad Imps Actual',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adition.visibility.description}',
        text: 'Visibility of the ad',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adition.visibility}',
        text: 'Visibility (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adobe.cm_average_time_on_site_defaultmetric.description}',
        text: 'The average amount of time a user spends on your site',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adobe.cm_average_time_on_site_defaultmetric}',
        text: 'Avarage time spent (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adobe.metrics.bouncerate.description}',
        text: 'Total Bouncerate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adobe.metrics.bouncerate}',
        text: 'Bounce rate (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adobe.metrics.bounces.description}',
        text: 'Total amount of Bounces',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adobe.metrics.bounces}',
        text: 'Bounces (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adobe.metrics.itemtimespent.description}',
        text: 'The total amount of time spend per item on your website',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adobe.metrics.itemtimespent}',
        text: 'Time spent per item (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adobe.metrics.pageviews.description}',
        text: 'Total Page Views/Impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adobe.metrics.pageviews}',
        text: 'Impressions (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adobe.metrics.timespentvisit.description}',
        text: 'The total amount of time spend per visit on your website ',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adobe.metrics.timespentvisit}',
        text: 'Time spent per visit (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adobe.metrics.visitors.description}',
        text: 'Amount of unique visitors on your site',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adobe.metrics.visitors}',
        text: 'Unique visitors (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adobe.metrics.visits.description}',
        text: 'Amount of visits on your site (can be recurring)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adobe.metrics.visits}',
        text: 'Sessions (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adunittech.clicks.description}',
        text: 'Ad Clicks in total.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adunittech.clicks}',
        text: 'Clicks (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adunittech.conversions.description}',
        text: 'Amount of Conversions i.e. users who clicked through or did the respective action.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adunittech.conversions}',
        text: 'Conversions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adunittech.ctr.description}',
        text: 'Click-through-rate for your ad. Equal to the number of clicks divided by the number of impressions for each ad.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adunittech.ctr}',
        text: 'CTR (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adunittech.ecpa.description}',
        text: 'Effective Cost per acquisition (CPA), i.e. cost per conversion',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adunittech.ecpa}',
        text: 'CPA (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adunittech.ecpc.description}',
        text: 'Effective Cost per Click',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adunittech.ecpc}',
        text: 'CPC (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adunittech.ecpm.description}',
        text: 'Effective cost per thousand impressions (technically, "effective cost per mille").',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adunittech.ecpm}',
        text: 'CPM (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adunittech.impressions.description}',
        text: 'Amount of Impressions in the given timeframe',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adunittech.impressions}',
        text: 'Impressions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adunittech.totalSpend.description}',
        text: 'Total cost of all ad spendings in the respective period.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adunittech.totalSpend}',
        text: 'Ad costs (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:appstore.activeDevices.description}',
        text: 'Active Devices',
        __typename: 'Translation',
      },
      {
        key: '{measurement:appstore.activeDevices}',
        text: 'Active devices (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:appstore.crashes.description}',
        text: 'Crashes',
        __typename: 'Translation',
      },
      {
        key: '{measurement:appstore.crashes}',
        text: 'Crashes (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:appstore.iap.description}',
        text: 'In-App Purchases',
        __typename: 'Translation',
      },
      {
        key: '{measurement:appstore.iap}',
        text: 'In-App purchases (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:appstore.impressions.description}',
        text: 'Impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:appstore.impressions}',
        text: 'Impressions (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:appstore.impressionsUnique.description}',
        text: 'Unique Impressions/Reach',
        __typename: 'Translation',
      },
      {
        key: '{measurement:appstore.impressionsUnique}',
        text: 'Unique impressions/Reach (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:appstore.installs.description}',
        text: 'Installs',
        __typename: 'Translation',
      },
      {
        key: '{measurement:appstore.installs}',
        text: 'Installs (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:appstore.pageViews.description}',
        text: 'Page Views',
        __typename: 'Translation',
      },
      {
        key: '{measurement:appstore.pageViews}',
        text: 'Page views (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:appstore.payingUsers.description}',
        text: 'Paying Users',
        __typename: 'Translation',
      },
      {
        key: '{measurement:appstore.payingUsers}',
        text: 'Paying users (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:appstore.reviews.description}',
        text: 'Total amount of Reviews in the Apple App Store',
        __typename: 'Translation',
      },
      {
        key: '{measurement:appstore.reviews}',
        text: 'Reviews (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:appstore.sales.description}',
        text: 'Sales',
        __typename: 'Translation',
      },
      {
        key: '{measurement:appstore.sales}',
        text: 'Sales (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:appstore.score.description}',
        text: 'The current Score of your App in the Apple App Store (Mobile App)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:appstore.score}',
        text: 'App score (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:appstore.sessions.description}',
        text: 'Sessions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:appstore.sessions}',
        text: 'Sessions (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:appstore.units.description}',
        text: 'Unit Sales',
        __typename: 'Translation',
      },
      {
        key: '{measurement:appstore.units}',
        text: 'Unit sales (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:blink.click_count.description}',
        text: 'Total Clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:blink.click_count}',
        text: 'Clicks (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.contacts.description}',
        text: 'Number of contacts',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.contacts}',
        text: 'New contacts (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:blog.ctaClicks.description}',
        text: 'The total number of clicks on all calls-to-action on the page',
        __typename: 'Translation',
      },
      {
        key: '{measurement:blog.ctaClicks}',
        text: 'CTA clicks (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:blog.ctaRate.description}',
        text: 'Percentage of page views resulting in a call-to-action click.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:blog.ctaRate}',
        text: 'CTA rate (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:channel.grouping.affiliates}',
        text: 'Users channel affiliates (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:channel.grouping.affiliates.description}',
        text: 'Amount of users from channel Affiliates.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:channel.grouping.direct}',
        text: 'Users channel direct (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:channel.grouping.direct.description}',
        text: 'Amount of users from channel Direct.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:channel.grouping.display}',
        text: 'Users channel display (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:channel.grouping.display.description}',
        text: 'Amount of users from channel Display.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:channel.grouping.email}',
        text: 'Users channel email (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:channel.grouping.email.description}',
        text: 'Amount of users from channel email.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:channel.grouping.organicsearch}',
        text: 'Users channel organic search (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:channel.grouping.organicsearch.description}',
        text: 'Amount of users from channel Organic Search.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:channel.grouping.other}',
        text: 'Users channel other (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:channel.grouping.other.description}',
        text: 'Amount of users from channel Other.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:channel.grouping.otheradvertising}',
        text: 'Users channel other advertising (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:channel.grouping.otheradvertising.description}',
        text: 'Amount of users from channel Other Advertising.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:channel.grouping.paidsearch}',
        text: 'Users channel paid search (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:channel.grouping.paidsearch.description}',
        text: 'Amount of users from channel Paid Search.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:channel.grouping.referral}',
        text: 'Users channel referral (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:channel.grouping.referral.description}',
        text: 'Amount of users from channel Referral.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:channel.grouping.social}',
        text: 'Users channel social (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:channel.grouping.social.description}',
        text: 'Amount of users from channel Social.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:domain.bounceRate.description}',
        text: 'Percentage of single-page session, to the total sessions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:domain.bounceRate}',
        text: 'Bounce rate (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:domain.bounces.description}',
        text: 'Number of single page sessions on your website (no further navigation)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:domain.bounces}',
        text: 'Bounces (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.leads.description}',
        text: 'Number of Lead generated',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.leads}',
        text: 'Leads (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:domain.newVisitorSessionRate.description}',
        text: 'Amount of new Visitors of all Sessions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:domain.newVisitorSessionRate}',
        text: 'New session % (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:domain.pageViewsPerSession.description}',
        text: 'Number of pages visited per Session (avg)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:domain.pageViewsPerSession}',
        text: 'Page views per Session (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:domain.sessionToContactRate.description}',
        text: 'Rate of Sessions to Contact (i.e. what amount of Sessions fill the contact)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:domain.sessionToContactRate}',
        text: 'Contact conversion rate (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:domain.subscribers.description}',
        text: 'Number of subscribers on your website',
        __typename: 'Translation',
      },
      {
        key: '{measurement:domain.subscribers}',
        text: 'Subscribers (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:domain.visitors.description}',
        text: 'Amount of unique-Users on your website (Visitors)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:domain.visitors}',
        text: 'New visitor sessions (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:domain.visits.description}',
        text: 'Sessions on your page',
        __typename: 'Translation',
      },
      {
        key: '{measurement:domain.visits}',
        text: '*deprecated by hubspot* - Sessions (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ecommerce.productDetailViews.description}',
        text: 'Amount of views on a specific product',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ecommerce.productDetailViews}',
        text: 'Product details (E-Commerce) (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ecommerce.itemquantity.description}',
        text: 'Total amount of purchases of this product.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ecommerce.itemquantity}',
        text: 'Quantity (E-Commerce) (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ecommerce.itemRevenue.description}',
        text: 'Sum of revenue of this product.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ecommerce.itemRevenue}',
        text: 'Revenue (E-Commerce) (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ecommerce.transactionRevenue.description}',
        text: 'Sum of revenue of this transaction.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ecommerce.transactionRevenue}',
        text: 'Transaction Revenue (E-Commerce) (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ecommerce.addstocart.description}',
        text: 'Number of times the product was added to the shopping cart (Enhanced Ecommerce).',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ecommerce.addstocart}',
        text: 'Product Adds To Cart (E-Commerce) (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:exchangeratesapi.ratio}',
        text: 'Exchange rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:exchangeratesapi.ratio.description}',
        text: 'Exchange rate from a base currency to a foreign currency',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.actions.description}',
        text: 'Actions/Conversions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.actions}',
        text: 'Actions/Conversions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.clicks.description}',
        text: 'Clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.clicks}',
        text: 'Clicks (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.linkClicks.description}',
        text: 'The number of clicks on links to select destinations',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.linkClicks}',
        text: 'Link clicks (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.cost_per_inline_link_click.description}',
        text: 'Cost per link click',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.cost_per_inline_link_click}',
        text: 'Cost per link click (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.reach.description}',
        text: 'The number of people who saw your ads at least once',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.reach}',
        text: 'Reach (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.cpc.description}',
        text: 'Cost per Click',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.cpc}',
        text: 'CPC (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.cpm.description}',
        text: 'Cost per Thousand - Impression',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.cpm}',
        text: 'CPM (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.ctr.description}',
        text: 'Click-through Rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.ctr}',
        text: 'CTR (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.impressions.description}',
        text: 'Impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.impressions}',
        text: 'Impressions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.pageFans.description}',
        text: 'Total amount of page likes/fans',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.pageFans}',
        text: 'Page fans (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.pageImpressions.description}',
        text: 'Total amount of page impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.pageImpressions}',
        text: 'Page impressions (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.spend.description}',
        text: 'Spendings in respective currency',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.spend}',
        text: 'Spendings (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postImpressions}',
        text: 'Post impressions (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postImpressions.description}',
        text: "The number of times your page's post entered a person's screen.",
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postImpressionsOrganic}',
        text: 'Post impressions (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postImpressionsOrganic.description}',
        text: "The number of times your Page's posts entered a person's screen through unpaid distribution",
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postImpressionsPaid}',
        text: 'Post impressions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postImpressionsPaid.description}',
        text: "The number of times your Page's post entered a person's screen through paid distribution such as an ad",
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postLikes}',
        text: 'Post likes (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postLikes.description}',
        text: 'Total like reactions of a post.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postShares}',
        text: 'Post shares (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postShares.description}',
        text: 'The number of times your post was shared.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postComments}',
        text: 'Post comments (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postComments.description}',
        text: 'The number of replies to your post.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postImpressionsUnique}',
        text: 'Post impressions unique/reach (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postImpressionsUnique.description}',
        text: "The number of people who had your page's post enter their screen.",
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postImpressionsUniqueOrganic}',
        text: 'Post impressions unique/reach (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postImpressionsUniqueOrganic.description}',
        text: "The number of people who had your Page's post enter their screen through unpaid distribution",
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postImpressionsUniquePaid}',
        text: 'Post impressions unique/reach (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postImpressionsUniquePaid.description}',
        text: "The number of people who had your Page's post enter their screen through paid distribution such as an ad",
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postEngagedUsers}',
        text: 'Engaged users (posts) (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postEngagedUsers.description}',
        text: 'The number of people who clicked anywhere in your posts.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.pageEngagedUsers}',
        text: 'Engaged users (page) (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.pageEngagedUsers.description}',
        text: 'The number of people who engaged with your Page.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.pageImpressionsUnique}',
        text: 'Page impressions unique/reach (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.pageImpressionsUnique.description}',
        text: 'The number of people who had any content from your page enter their screen.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.videoActions}',
        text: 'Video play actions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.videoActions.description}',
        text: 'The number of times your video ad starts to play.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.videoAvgTime}',
        text: 'Video avg. time (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.videoAvgTime.description}',
        text: 'The average time a video was played.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.videoCost}',
        text: 'Video avg. cost (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.videoCost.description}',
        text: 'The average cost for each 10-second video view.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.pageVideoViews}',
        text: 'Page video views (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.pageVideoViews.description}',
        text: "The number of times your Page's videos played for at least 3 seconds, by organic reach",
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.pageVideoViewsOrganic}',
        text: 'Page video views (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.pageVideoViewsOrganic.description}',
        text: "The number of times your page's videos played for at least 3 seconds.",
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.pageVideoViewsPaid}',
        text: 'Page video views (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.pageVideoViewsPaid.description}',
        text: "The number of times your page's promoted videos played for at least 3 seconds.",
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.pageVideoViewsUnique}',
        text: 'Page video views unique (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.pageVideoViewsUnique.description}',
        text: "The number of people who viewed your page's videos for at least 3 seconds.",
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postVideoViews}',
        text: 'Post video views (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postVideoViews.description}',
        text: "The number of times your post's videos played for at least 3 seconds.",
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postVideoViewsOrganic}',
        text: 'Post video views (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postVideoViewsOrganic.description}',
        text: "The number of times your post's videos played for at least 3 seconds, by organic reach.",
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postVideoViewsPaid}',
        text: 'Post video views (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postVideoViewsPaid.description}',
        text: "The number of times your post's promoted videos played for at least 3 seconds.",
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postVideoViewsUnique}',
        text: 'Post video views unique (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postVideoViewsUnique.description}',
        text: "The number of people who viewed your post's video for at least 3 seconds.",
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postVideoViewsUniqueOrganic}',
        text: 'Post video views unique (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postVideoViewsUniqueOrganic.description}',
        text: "The number of people who viewed your post's video for at least 3 seconds, by organic reach.",
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postVideoViewsUniquePaid}',
        text: 'Post video views unique (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postVideoViewsUniquePaid.description}',
        text: "The number of people who viewed your post's promoted video for at least 3 seconds.",
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postVideoAvgTime}',
        text: 'Post video avg. time (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postVideoAvgTime.description}',
        text: "The average time, in milliseconds, people viewed your post's video.",
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.totalAmountOfPosts}',
        text: 'Posts (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.totalAmountOfPosts.description}',
        text: 'Total amount of posts',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.customConversionDefault}',
        text: 'Custom conversions default (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.customConversionDefault.description}',
        text: 'The Custom Conversions defined by the advertiser, with a default attribution window.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.customConversion7dClick}',
        text: 'Custom conversions 7d click (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.customConversion7dClick.description}',
        text: 'The Custom Conversions defined by the advertiser, with a 7 day click attribution window.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.customConversion1dView}',
        text: 'Custom conversions 1d view (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.customConversion1dView.description}',
        text: 'The Custom Conversions defined by the advertiser, with a 1 day view attribution window.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.pageTotalActions.description}',
        text: "The number of clicks on your Page's contact info and CTA button",
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.pageTotalActions}',
        text: 'Page clicks (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postClicks.description}',
        text: 'The number of times people clicked on anywhere in your posts',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.postClicks}',
        text: 'Post clicks (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.actionComment.description}',
        text: 'Comments on your boosted posts',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.actionComment}',
        text: 'Post comments (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.actionLike.description}',
        text: 'Page likes',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.actionLike}',
        text: 'Page likes (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.actionPost.description}',
        text: 'Post shares',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.actionPost}',
        text: 'Post shares (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.actionPostReaction.description}',
        text: 'The number of reactions on your ads or boosted posts: Like, Love, Haha, Wow, Sad or Angry',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.actionPostReaction}',
        text: 'Post reactions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.action_pixel_purchase.description}',
        text: 'The number of purchase events tracked by the pixel on your website',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.action_pixel_purchase}',
        text: 'Conversions - Purchases (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.action_value_pixel_purchase.description}',
        text: 'The total value of purchase conversions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.action_value_pixel_purchase}',
        text: 'Conversions - Purchase value (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.action_value_pixel_add_to_cart.description}',
        text: 'The total value of add to cart conversions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.action_value_pixel_add_to_cart}',
        text: 'Conversions - Add to cart value (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.action_pixel_add_to_cart.description}',
        text: 'The total add to cart conversions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.action_pixel_add_to_cart}',
        text: 'Conversions - Add to cart (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.action_pixel_initiate_checkout.description}',
        text: 'The number of initiate checkout events tracked by the pixel on your website',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.action_pixel_initiate_checkout}',
        text: 'Conversions - Initiate checkout (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.action_value_pixel_initiate_checkout.description}',
        text: 'The total value of initiate checkout conversions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.action_value_pixel_initiate_checkout}',
        text: 'Conversions - Initiate checkout value (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.action_pixel_view_content.description}',
        text: 'The number of view content events tracked by the pixel on your website',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.action_pixel_view_content}',
        text: 'Conversions - View content (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.action_pixel_lead.description}',
        text: 'The number of leads tracked by the pixel on your website',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.action_pixel_lead}',
        text: 'Leads (pixel) (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.action_pixel_lead_1d_view.description}',
        text: 'The number of 1d view attributed leads tracked by the pixel on your website',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.action_pixel_lead_1d_view}',
        text: 'Leads (pixel) - 1d view (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.action_pixel_lead_7d_click.description}',
        text: 'The number of 7d click attributed leads tracked by the pixel on your website',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.action_pixel_lead_7d_click}',
        text: 'Leads (pixel) - 7d click (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.action_value_pixel_view_content.description}',
        text: 'The total value of view content conversions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.action_value_pixel_view_content}',
        text: 'Conversions - View content value (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.pageImpressionsOrganic.description}',
        text: "The number of times any content from your Page or about your Page entered a person's screen through unpaid distribution",
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.pageImpressionsOrganic}',
        text: 'Page impressions (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.pageImpressionsPaid.description}',
        text: "The number of times any content from your Page or about your Page entered a person's screen through paid distribution",
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.pageImpressionsPaid}',
        text: 'Page impressions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.pageImpressionsUniqueOrganic.description}',
        text: 'The number of people who had any content from your Page or about your Page enter their screen through unpaid distribution',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.pageImpressionsUniqueOrganic}',
        text: 'Page impressions unique/reach (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.pageImpressionsUniquePaid.description}',
        text: 'The number of people who had any content from your Page or about your Page enter their screen through paid distribution',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.pageImpressionsUniquePaid}',
        text: 'Page impressions unique/reach (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:form.formViews.description}',
        text: 'Number of Views on your Forms',
        __typename: 'Translation',
      },
      {
        key: '{measurement:form.formViews}',
        text: 'Form Views (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:form.interactions.description}',
        text: 'Number of interactions with your Form',
        __typename: 'Translation',
      },
      {
        key: '{measurement:form.interactions}',
        text: 'Interactions (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gplay.charge_amount.description}',
        text: 'Charges Total',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gplay.charge_amount}',
        text: 'Charges (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gplay.daily_average_rating.description}',
        text: 'Daily Avg. Raiting',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gplay.daily_average_rating}',
        text: 'Daily avg. rating (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gplay.daily_user_installs.description}',
        text: 'Daily User Installations',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gplay.daily_user_installs}',
        text: 'Daily user installations (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gplay.ratings.description}',
        text: 'Total amount of Rating in the Google Play Store',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gplay.ratings}',
        text: 'Ratings (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gplay.refund_amount.description}',
        text: 'Refunds Total',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gplay.refund_amount}',
        text: 'Refunds (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gplay.reviews_star_rating.description}',
        text: 'Reviews Start Rating',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gplay.reviews_star_rating}',
        text: 'Reviews star rating (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gplay.reviews.description}',
        text: 'Total amount of Reviews in the Google Play Store',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gplay.reviews}',
        text: 'Reviews (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gplay.sales_charged.description}',
        text: 'Sales',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gplay.sales_charged}',
        text: 'Sales (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gplay.sales_refund.description}',
        text: 'Sales - Refunds',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gplay.sales_refund}',
        text: 'Sales refunds (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gplay.score.description}',
        text: 'The current Score of your App in Google Play Store (Mobile App)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gplay.score}',
        text: 'App score (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.activeviewimpressions.description}',
        text: 'A measurement of how often your ad has become viewable on a Display Network site.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.activeviewimpressions}',
        text: 'Active view impressions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.activeviewmeasurableimpressions.description}',
        text: 'The number of times your ads are appearing on placements in positions where they can be seen.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.activeviewmeasurableimpressions}',
        text: 'Active view measurable impressions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.allconversions.description}',
        text: 'The total number of conversions which includes conversion from "Call" button and "Get Directions" button etc. This only includes conversion actions which include_in_conversions_metric attribute is set to true.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.allconversions}',
        text: 'Conversions (all sources) (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.clicks.description}',
        text: 'The number of clicks.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.clicks}',
        text: 'Clicks (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.conversions.description}',
        text: 'The number of conversions. This only includes conversion actions which include_in_conversions_metric attribute is set to true.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.conversions}',
        text: 'Conversions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.conversionsvalue.description}',
        text: 'The total value of conversions. This only includes conversion actions which include_in_conversions_metric attribute is set to true.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.conversionsvalue}',
        text: 'Conversions value (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.allconversionsvalue.description}',
        text: 'The total value of conversions which includes conversion from "Call" button and "Get Directions" button etc. This only includes conversion actions which include_in_conversions_metric attribute is set to true.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.allconversionsvalue}',
        text: 'Conversions value (all sources) (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.averagecpc.description}',
        text: 'The total cost of all clicks divided by the total number of clicks received.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.averagecpc}',
        text: 'Average CPC (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.averagecpm.description}',
        text: 'Average cost-per-thousand impressions (CPM).',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.averagecpm}',
        text: 'Average CPM (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.costmicros.description}',
        text: 'The sum of your ad spends/cost of Google Ads.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.costmicros}',
        text: 'Cost (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.ctr.description}',
        text: 'The number of clicks your ad receives (Clicks) divided by the number of times your ad is shown (Impressions).',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.ctr}',
        text: 'CTR (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.engagements.description}',
        text: 'The number of engagements. An engagement occurs when a viewer expands your Lightbox ad. Also, in the future, other ad types may support engagement metrics.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.engagements}',
        text: 'Engagements (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.impressions.description}',
        text: 'Count of how often your ad has appeared on a search results page or website on the Google Network.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.impressions}',
        text: 'Impressions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.interactions.description}',
        text: 'The number of interactions. An interaction is the main user action associated with an ad format-clicks for text and shopping ads, views for video ads, and so on.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.interactions}',
        text: 'Interactions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.videoviews.description}',
        text: 'The number of times your video ads were viewed.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.videoviews}',
        text: 'Video views (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.search_impression_share.description}',
        text: "The impressions you've received on the Search Network divided by the estimated number of impressions you were eligible to receive.",
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.search_impression_share}',
        text: 'Search Impression Share (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.content_impression_share.description}',
        text: "The impressions you've received on the Display Network divided by the estimated number of impressions you were eligible to receive.",
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.content_impression_share}',
        text: 'Content Impression Share (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.search_click_share.description}',
        text: "The number of clicks you've received on the Search Network divided by the estimated number of clicks you were eligible to receive.",
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.search_click_share}',
        text: 'Search Click Share (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.search_absolute_top_impression_share.description}',
        text: "The percentage of the customer's Shopping or Search ad impressions that are shown in the most prominent Shopping position.",
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.search_absolute_top_impression_share}',
        text: 'Search Absolute Top Impression Share (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.search_top_impression_share.description}',
        text: "The impressions you've received in the top location (anywhere above the organic search results) compared to the estimated number of impressions you were eligible to receive in the top location.",
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.search_top_impression_share}',
        text: 'Search Top Impression Share (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:growth}',
        text: 'Growth (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.broadcasts.clicks.description}',
        text: 'Clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.broadcasts.clicks}',
        text: 'Clicks (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.broadcasts.contactsPerPageview.description}',
        text: 'Contacts per Pageview',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.broadcasts.contactsPerPageview}',
        text: 'Contacts per pageview (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.broadcasts.contactToCustomerRate.description}',
        text: 'Contract-to-Customer Rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.broadcasts.contactToCustomerRate}',
        text: 'Customer conversion rate (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.broadcasts.customers.description}',
        text: 'Customers',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.broadcasts.customers}',
        text: 'Customers (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.broadcasts.customersPerPageview.description}',
        text: 'Customers per Pageview',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.broadcasts.customersPerPageview}',
        text: 'Customers per pageview (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.broadcasts.interactionsCount.description}',
        text: 'Interactions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.broadcasts.interactionsCount}',
        text: 'Interactions (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.broadcasts.likes.description}',
        text: 'Likes',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.broadcasts.likes}',
        text: 'Likes (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.broadcasts.opportunities.description}',
        text: 'Opportunities',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.broadcasts.opportunities}',
        text: 'Opportunities (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.broadcasts.replies.description}',
        text: 'Replies',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.broadcasts.replies}',
        text: 'Replies (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.broadcasts.retweets.description}',
        text: 'Retweets',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.broadcasts.retweets}',
        text: 'Retweets (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.source.direct.rawViews}',
        text: 'Page views (Source: direct) (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.source.direct.rawViews.description}',
        text: 'The number of times a visitor has viewed a page on your website (source: direct)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.source.direct.visits}',
        text: 'Sessions (Source: direct) (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.source.direct.visits.description}',
        text: 'The number of sessions that started with viewing this page first (source: direct)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.source.direct.bounces}',
        text: 'Bounces (Source: direct) (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.source.direct.bounces.description}',
        text: 'The number of bounces (source: direct)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.source.direct.bounceRate}',
        text: 'Bounce rate (Source: direct) (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.source.direct.bounceRate.description}',
        text: 'Bounce Rate (source: direct)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.source.direct.timePerSession}',
        text: 'Avg. session length (Source: direct) (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.source.direct.timePerSession.description}',
        text: 'The average amount of time a visitor stays on this page (source: direct)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.source.direct.returningVisits}',
        text: 'Returning visits (Source: direct) (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.source.direct.returningVisits.description}',
        text: 'Returning Visits (source: direct)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.source.organic.rawViews}',
        text: 'Page views (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.source.organic.rawViews.description}',
        text: 'The number of times a visitor has viewed a page on your website (source: organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.source.organic.visits}',
        text: 'Sessions (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.source.organic.visits.description}',
        text: 'The number of sessions that started with viewing this page first (source: organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.source.organic.bounces}',
        text: 'Bounces (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.source.organic.bounces.description}',
        text: 'The number of bounces (source: organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.source.organic.bounceRate}',
        text: 'Bounce rate (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.source.organic.bounceRate.description}',
        text: 'Bounce Rate (source: organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.source.organic.timePerSession}',
        text: 'Time per session (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.source.organic.timePerSession.description}',
        text: 'The average amount of time a visitor stays on this page (source: organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.source.organic.returningVisits}',
        text: 'Returning visits (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.source.organic.returningVisits.description}',
        text: 'Returning Visits (source: organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.workflow.completed.description}',
        text: 'Amount of users who completed your workflow',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.workflow.completed}',
        text: 'Completed (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.workflow.enrolled.description}',
        text: 'Contacts enrolled into the mail workflow',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.workflow.enrolled}',
        text: 'Enrolled (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.workflow.unenrolled.description}',
        text: 'Amount of contacts unenrolled/not enrolled anymore into the mail workflow',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.workflow.unenrolled}',
        text: 'Unenrolled (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.email.sent.description}',
        text: 'Emails sent',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.email.sent}',
        text: 'Emails sent (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.email.delivered.description}',
        text: 'Delivered mails',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.email.delivered}',
        text: 'Delivered mails (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.email.bounce.description}',
        text: 'Emails bounced',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.email.bounce}',
        text: 'Emails bounced (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.email.open.description}',
        text: 'Emails opened',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.email.open}',
        text: 'Emails opened (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.email.click.description}',
        text: 'Amount of clicks on a link within the message',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.email.click}',
        text: 'Emails clicked (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.email.spamreport.description}',
        text: 'Amount of flaged messages as spamr',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.email.spamreport}',
        text: 'Email spamreports (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagram.followers.description}',
        text: 'Amount of people who follow you profile',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagram.followers}',
        text: 'Followers (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagram.following.description}',
        text: 'Amount of people you are following',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagram.following}',
        text: 'Following (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagram.posts.description}',
        text: 'Amount of posts you created in this timeframe',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagram.posts}',
        text: 'Posts (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.impressions}',
        text: 'Impressions (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.impressions.description}',
        text: 'Total number of times your media objects (i.e. posts, stories) have been viewed. Includes ad-activity generated trough the api.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.profileViews}',
        text: 'Profile views (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.profileViews.description}',
        text: 'Total number of users who have viewed your profile.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.websiteClicks}',
        text: 'Website clicks (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.websiteClicks.description}',
        text: 'Total number of taps on the website link in your user profile.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.following}',
        text: 'Following (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.following.description}',
        text: 'Total number of people you are following.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.followers}',
        text: 'Followers (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.followers.description}',
        text: 'Total number of new followers.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.mediaImpressions}',
        text: 'Media impressions (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.mediaImpressions.description}',
        text: 'Total number of times the media object has been seen.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.mediaEngagement}',
        text: 'Media engagement (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.mediaEngagement.description}',
        text: 'Total number of likes and comments on the media object.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.mediaVideoViews}',
        text: 'Media video views (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.mediaVideoViews.description}',
        text: 'Total number of times the video has been seen.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.mediaTotalCount}',
        text: 'Posts (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.mediaTotalCount.description}',
        text: 'Total amount of posts.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.reach.description}',
        text: 'Total number of unique users who have viewed at least one of your media. Includes ad activity generated through the API, Facebook ads interfaces, and the Promote feature.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.reach}',
        text: 'Reach (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.impressions.description}',
        text: 'Impressions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.impressions}',
        text: 'Impressions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.reach.description}',
        text: 'The number of people who saw your ads at least once',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.reach}',
        text: 'Reach (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.clicks.description}',
        text: 'Clicks (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.clicks}',
        text: 'Clicks (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.linkClicks.description}',
        text: 'The number of clicks on links to select destinations',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.linkClicks}',
        text: 'Link clicks (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.cpc.description}',
        text: 'Cost per Click',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.cpc}',
        text: 'CPC (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.cpm.description}',
        text: 'Cost per Thousand - Impression',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.cpm}',
        text: 'CPM (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.ctr.description}',
        text: 'Click-through Rate (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.ctr}',
        text: 'CTR (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.spend.description}',
        text: 'Spendings in respective currency',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.spend}',
        text: 'Spendings (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.videoActions}',
        text: 'Video play actions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.videoActions.description}',
        text: 'The number of times your video starts to play.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.videoAvgTime}',
        text: 'Video avg. time (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.videoAvgTime.description}',
        text: 'The average time a video was played.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.actionComment.description}',
        text: 'Post comments (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.actionComment}',
        text: 'Post comments (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.actionLike.description}',
        text: 'Page likes (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.actionLike}',
        text: 'Page likes (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.actionPost.description}',
        text: 'Post shares (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.actionPost}',
        text: 'Post shares (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.actionPostReaction.description}',
        text: 'The number of reactions on your ads or boosted posts: Like, Love, Haha, Wow, Sad or Angry',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.actionPostReaction}',
        text: 'Post reactions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.cost_per_inline_link_click.description}',
        text: 'Cost per link click',
        __typename: 'Translation',
      },
      {
        key: '{measurement:instagramV2.ads.cost_per_inline_link_click}',
        text: 'Cost per link click (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.clicks.description}',
        text: 'Ad Clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.clicks}',
        text: 'Clicks (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.comments.description}',
        text: 'Ad Comments',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.comments}',
        text: 'Comments (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.companyPageClicks.description}',
        text: 'Ad related Company page Clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.companyPageClicks}',
        text: 'Company-Page clicks (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.costInUsd.description}',
        text: 'Ad Costs (USD) (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.costInUsd}',
        text: 'Ad Costs (USD) (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.costInLocalCurrency.description}',
        text: 'Ad Costs (Local Currency) (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.costInLocalCurrency}',
        text: 'Ad Costs (Local Currency) (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.follows.description}',
        text: 'Ad/Paid followers gained trough campaigns',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.follows}',
        text: 'Followers (campaigns) (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.fullScreenPlays.description}',
        text: 'Ad Full-Screen Plays',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.fullScreenPlays}',
        text: 'Full-Screen plays (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.impressions.description}',
        text: 'Ad related Impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.impressions}',
        text: 'Impressions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.likes.description}',
        text: 'Ad related Likes',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.likes}',
        text: 'Likes (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.oneClickLeads.description}',
        text: 'The count of leads generated through One Click Lead Gen.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.oneClickLeads}',
        text: 'Leads',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.oneClickLeadFormOpens.description}',
        text: 'The count of times users opened the lead form for a One Click Lead Gen campaign.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.oneClickLeadFormOpens}',
        text: 'Lead Form Opened',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.opens.description}',
        text: 'Ad Opens Total',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.opens}',
        text: 'Opens (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.totalEngagements.description}',
        text: 'Ad Total Engagements',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.totalEngagements}',
        text: 'Engagement (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.videoViews.description}',
        text: 'Ad Total Video Views',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.videoViews}',
        text: 'Video views (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.shares.description}',
        text: 'The count of shares. Sponsored Updates only.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.shares}',
        text: 'Shares (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.videoStarts.description}',
        text: 'The count of video ads that were started by users.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.videoStarts}',
        text: 'Video starts (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.approximateUniqueImpressions.description}',
        text: 'The number of instances where a unique user viewed an ad served to them by LinkedIn.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.ads.approximateUniqueImpressions}',
        text: 'Reach (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.organicFollowerGain.description}',
        text: 'Organic follower gain',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.organicFollowerGain}',
        text: 'Follower gain (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.pageViews.description}',
        text: 'Total Page Views',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.pageViews}',
        text: 'Page views (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.paidFollowerGain.description}',
        text: 'Paid follower gain',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.paidFollowerGain}',
        text: 'Follower gain (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.totalFollowerCount.description}',
        text: 'Total amount of followers',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.totalFollowerCount}',
        text: 'Followers (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.uniquePageViews.description}',
        text: 'Unique Page Views',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.uniquePageViews}',
        text: 'Unique page views (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.sharesShareCount.description}',
        text: 'Number of times your posts got shared',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.sharesShareCount}',
        text: 'Shares (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.sharesClickCount.description}',
        text: 'Number of clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.sharesClickCount}',
        text: 'Clicks (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.sharesEngagement.description}',
        text: 'Number of organic clicks, likes, comments, and shares',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.sharesEngagement}',
        text: 'Engagement (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.sharesEngagementRate.description}',
        text: 'Number of organic clicks, likes, comments, and shares over impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.sharesEngagementRate}',
        text: 'Engagement rate (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.sharesLikeCount.description}',
        text: 'Number of likes',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.sharesLikeCount}',
        text: 'Likes (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.sharesImpressionCount.description}',
        text: 'Number of impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.sharesImpressionCount}',
        text: 'Impressions (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.sharesCommentCount.description}',
        text: 'Number of comments',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.sharesCommentCount}',
        text: 'Comments (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.sharesTotalCount.description}',
        text: 'Total amount of posts.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.sharesTotalCount}',
        text: 'Posts (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.shareVideoViews.description}',
        text: 'Number of times your video got viewed',
        __typename: 'Translation',
      },
      {
        key: '{measurement:linkedin.shareVideoViews}',
        text: 'Video views (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.abuse_reports.description}',
        text: 'Amount of abuse-reports by users after they got your Mail',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.abuse_reports}',
        text: 'Abuse reports (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.bounces.hard_bounces.description}',
        text: 'Total amount of Hard Bounces',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.bounces.hard_bounces}',
        text: 'Hard bounces (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.bounces.soft_bounces.description}',
        text: 'Total amount of soft bounces',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.bounces.soft_bounces}',
        text: 'Soft bounces (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.click.description}',
        text: 'Amount of clicks on your sent email',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.click}',
        text: 'Clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.clicks.click_rate.description}',
        text: 'Click Rate (opened/clicks)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.clicks.click_rate}',
        text: 'Click rate (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.clicks.clicks_total.description}',
        text: 'Total amount of Clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.clicks.clicks_total}',
        text: 'Clicks (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.clicks.unique_clicks.description}',
        text: 'Total amount of unique clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.clicks.unique_clicks}',
        text: 'Unique clicks (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.clicks.unique_subscriber_clicks.description}',
        text: 'Total amount of unique clicks of your subscribers',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.clicks.unique_subscriber_clicks}',
        text: 'Unique subscribers (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.emails_sent.description}',
        text: 'Total amount of sent E-Mails',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.emails_sent}',
        text: 'Emails sent (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.forwards.forwards_count.description}',
        text: 'Amount of Forwarded E-Mails',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.forwards.forwards_count}',
        text: 'Forwards count (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.forwards.forwards_opens.description}',
        text: 'Amount of opens in forwarded E-mails',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.forwards.forwards_opens}',
        text: 'Forwards open (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.industry_stats.abuse_rate.description}',
        text: 'Abuse Rate for your industry',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.industry_stats.abuse_rate}',
        text: 'Abuse report rate (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.industry_stats.bounce_rate.description}',
        text: 'Bounce Rate for your industry',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.industry_stats.bounce_rate}',
        text: 'Bounce rate (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.industry_stats.click_rate.description}',
        text: 'Click Rate for your industry',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.industry_stats.click_rate}',
        text: 'Click rate (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.industry_stats.open_rate.description}',
        text: 'Open Rate for your industry',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.industry_stats.open_rate}',
        text: 'Open rate (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.industry_stats.unopen_rate.description}',
        text: 'Unopen rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.industry_stats.unopen_rate}',
        text: 'Unopen rate (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.industry_stats.unsub_rate.description}',
        text: 'Unsubscription rate, amount of people unsubscribed after getting this email',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.industry_stats.unsub_rate}',
        text: 'Unsubscription rate (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.opening.description}',
        text: 'Total amount of opened E-Mails',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.opening}',
        text: 'Openings',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.opens.open_rate.description}',
        text: 'Open Rate in % (sent / opened)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.opens.open_rate}',
        text: 'Open rate (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.opens.opens_total.description}',
        text: 'Total amount of opened E-Mails',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.opens.opens_total}',
        text: 'Opens (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.opens.unique_opens.description}',
        text: 'Total amount of uniquly opened E-Mails',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.opens.unique_opens}',
        text: 'Unique opens (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.subscriber.description}',
        text: 'Total amount of Subscribers',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.subscriber}',
        text: 'Subscribers',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.unsubscribed.description}',
        text: 'Total amount of Unsubscribers',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.unsubscribed}',
        text: 'Unsubscribed (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailgun.accepted.description}',
        text: 'Accepted Mails',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailgun.accepted}',
        text: 'Accepted mails (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailgun.clicked.description}',
        text: 'Clicked',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailgun.clicked}',
        text: 'Clicks (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailgun.complained.description}',
        text: 'Complained',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailgun.complained}',
        text: 'Complained (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailgun.delivered.description}',
        text: 'Delivered Mails',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailgun.delivered}',
        text: 'Delivered mails (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailgun.failed_permanent.description}',
        text: 'Failed Delivery (permanent)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailgun.failed_permanent}',
        text: 'Permanent failed delivery (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailgun.failed_temporary.description}',
        text: 'Failed Delivery (temporary)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailgun.failed_temporary}',
        text: 'Temporary failed delivery (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailgun.opened.description}',
        text: 'Opened',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailgun.opened}',
        text: 'Opens (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailgun.stored.description}',
        text: 'Stored',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailgun.stored}',
        text: 'Stored (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailgun.unsubscribed.description}',
        text: 'Unsubscribed',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailgun.unsubscribed}',
        text: 'Unsubscribed (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailxpert.sent.description}',
        text: 'Total sent',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailxpert.sent}',
        text: 'Sent (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailxpert.openingCount.description}',
        text: 'Openings',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailxpert.openingCount}',
        text: 'Openings (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailxpert.openingRate.description}',
        text: 'Opening rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailxpert.openingRate}',
        text: 'Opening rate (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailxpert.receivingCount.description}',
        text: 'Receivings',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailxpert.receivingCount}',
        text: 'Receivings (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailxpert.clickCount.description}',
        text: 'Ammount of clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailxpert.clickCount}',
        text: 'Clicks (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailxpert.openingClickRate.description}',
        text: 'Opening click rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailxpert.openingClickRate}',
        text: 'Opening click rate (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailxpert.receivingClickRate.description}',
        text: 'Receiving click rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailxpert.receivingClickRate}',
        text: 'Receiving click rate (orgnaic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailxpert.unsubscriptionCount.description}',
        text: 'The number of unsubscribers.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailxpert.unsubscriptionCount}',
        text: 'Unsubscribes (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailxpert.unsubscriptionRate.description}',
        text: 'Unsubscription rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mailxpert.unsubscriptionRate}',
        text: 'Unsubscription rate (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mandrill.reputation.description}',
        text: 'Reputation',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mandrill.reputation}',
        text: 'Reputation (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mandrill.sent_total.description}',
        text: 'Total Sent',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mandrill.sent_total}',
        text: 'Sent (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pipedrive.amountOfDeals.description}',
        text: 'Total amount of deals in this stage/pipeline',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pipedrive.amountOfDeals}',
        text: 'Deals (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pipedrive.totalDealValue.description}',
        text: 'Total amount of value of all deals in this stage/pipeline',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pipedrive.totalDealValue}',
        text: 'Deal value (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:revenue.sum}',
        text: 'Revenue (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.backlinks.ascore.description}',
        text: 'Authority Score is a calculated  metric that scores the quality of a domain. The score is based on the backlinks, trust score, domain score and traffic data of SEMrush.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.backlinks.ascore}',
        text: 'Authority score (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.backlinks.domains_num.description}',
        text: 'Amount of Domains with a Backlink to your website/domain.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.backlinks.domains_num}',
        text: 'Backlink domains (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.backlinks.follows_num.description}',
        text: 'Amount of Follow-Link - links from other websites that count as positive for your SEO ranking.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.backlinks.follows_num}',
        text: 'Follow-links (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.backlinks.nofollows_num.description}',
        text: 'Amount of No Follow Links to your website (Links with rel:nofollow in the link)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.backlinks.nofollows_num}',
        text: 'No Follow-links (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.backlinks.score.description}',
        text: 'Domain Score tell you the importance of a domain, based on the amount of links pointing back to a domain. (0-100 scale) ',
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.backlinks.score}',
        text: 'Domain score (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.backlinks.total.description}',
        text: 'The total amount of Backlinks for a certain domain.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.backlinks.total}',
        text: 'Backlinks (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.domain.keywords_top_100_google.description}',
        text: 'Number of keywords that bring your domain into the top 100 search results of Google',
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.domain.keywords_top_100_google}',
        text: 'Keywords in top 100 (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.domain.organic_keywords.description}',
        text: "Organic keywords who bring users to your website (with Google's top 20 organic search results)",
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.domain.organic_keywords}',
        text: 'Keywords (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.domain.organic_traffic.description}',
        text: "Organic Traffic brought to your website (with Google's top 20 search results)",
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.domain.organic_traffic}',
        text: 'Traffic (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.domain.rank.description}',
        text: "Rating of your website's popularity based on organic traffic from Google (top 20 search results)",
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.domain.rank}',
        text: 'Rank (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.domain.total_keywords.description}',
        text: 'Total amount of keywords ',
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.domain.total_keywords}',
        text: 'Keywords (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.domain.visibility.description}',
        text: 'Domain’s visibility in Google’s top 100 organic search results for keywords',
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.domain.visibility}',
        text: 'Domain visibility (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.keyword.number_of_results.description}',
        text: 'Total number of organic results of a keyword.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.keyword.number_of_results}',
        text: 'Total results (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.keyword.position.description}',
        text: "Position your Domain gets with a particular keyword in Google's top 20 organic or paid search results.",
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.keyword.position}',
        text: 'Position (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.keyword.search_volume.description}',
        text: 'Average number of times users have searched for the keyword per month. (value is calculate over last 12 months)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.keyword.search_volume}',
        text: 'Search volume (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.keyword.traffic_percent.description}',
        text: 'Percentage of traffic driven to your domain with this keyword',
        __typename: 'Translation',
      },
      {
        key: '{measurement:semrush.keyword.traffic_percent}',
        text: 'Traffic % (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:thehouse.cost.description}',
        text: 'Total cost',
        __typename: 'Translation',
      },
      {
        key: '{measurement:thehouse.cost}',
        text: 'Cost (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:thehouse.impressions.description}',
        text: 'Amount of impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:thehouse.impressions}',
        text: 'Ad Imps Plan',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitter.followers.description}',
        text: 'Amount of people who follow you profile',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitter.followers}',
        text: 'Followers (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitter.following.description}',
        text: 'Amount of people you are following',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitter.following}',
        text: 'Following (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitter.likes.description}',
        text: 'Amount of likes you got in this timeframe',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitter.likes}',
        text: 'Likes (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitter.tweets.description}',
        text: 'Amount of tweets you created in this timeframe',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitter.tweets}',
        text: 'Tweets (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.labs.followers.description}',
        text: 'Amount of people who follow you profile',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.labs.followers}',
        text: 'Followers (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.labs.following.description}',
        text: 'Amount of people you are following',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.labs.following}',
        text: 'Following (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.labs.favorite}',
        text: 'Favorites (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.labs.favorite.description}',
        text: 'Total amount of favorites on tweets with hearths or other favorites',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.labs.tweets.description}',
        text: 'Amount of tweets you created in this timeframe',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.labs.tweets}',
        text: 'Tweets (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.labs.impressionCount.description}',
        text: 'Amount of views on your Tweets',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.labs.impressionCount}',
        text: 'Impressions (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.labs.likeCount.description}',
        text: 'Amount of times people liked your Tweets',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.labs.likeCount}',
        text: 'Likes (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.labs.quoteCount.description}',
        text: 'Amount of times your Tweets have been Retweeted with a new comment',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.labs.quoteCount}',
        text: 'Quotes (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.labs.replyCount.description}',
        text: 'Number of replies to your Tweets',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.labs.replyCount}',
        text: 'Replies (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.labs.retweetCount.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.labs.retweetCount}',
        text: 'Retweets (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.labs.videoViewCount.description}',
        text: 'Amount of times the video attached to your Tweets has been viewed',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.labs.videoViewCount}',
        text: 'Video views (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.labs.videoPlaybackCount.description}',
        text: 'The number of users who made it to 50% of the video',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.labs.videoPlaybackCount}',
        text: 'Video playbacks (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:visitors}',
        text: 'Amount of visitors on your website in the given timeframe',
        __typename: 'Translation',
      },
      {
        key: '{measurement:weatherstack.temperature.avg}',
        text: 'Temperature Average',
        __typename: 'Translation',
      },
      {
        key: '{measurement:weatherstack.temperature.avg.description}',
        text: 'Average temperature of the day',
        __typename: 'Translation',
      },
      {
        key: '{measurement:weatherstack.temperature.min}',
        text: 'Temperature Minimum',
        __typename: 'Translation',
      },
      {
        key: '{measurement:weatherstack.temperature.min.description}',
        text: 'Minimum temperature of the day',
        __typename: 'Translation',
      },
      {
        key: '{measurement:weatherstack.temperature.max}',
        text: 'Temperature Maximum',
        __typename: 'Translation',
      },
      {
        key: '{measurement:weatherstack.temperature.max.description}',
        text: 'Maximum temperature of the day',
        __typename: 'Translation',
      },
      {
        key: '{measurement:weatherstack.temperature.feelslike}',
        text: 'Feels like',
        __typename: 'Translation',
      },
      {
        key: '{measurement:weatherstack.temperature.feelslike.description}',
        text: 'Average feels like temperature of the day',
        __typename: 'Translation',
      },
      {
        key: '{measurement:weatherstack.humidity}',
        text: 'Air humidity',
        __typename: 'Translation',
      },
      {
        key: '{measurement:weatherstack.humidity.description}',
        text: 'Air humidity level (percentage)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:weatherstack.wind_speed}',
        text: 'Wind speed',
        __typename: 'Translation',
      },
      {
        key: '{measurement:weatherstack.wind_speed.description}',
        text: 'Wind speed (kilometers per hour)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:weatherstack.clouds}',
        text: 'Cloud coverage',
        __typename: 'Translation',
      },
      {
        key: '{measurement:weatherstack.clouds.description}',
        text: 'Cloud coverage (percentage)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:weatherstack.precipitation}',
        text: 'Precipitation',
        __typename: 'Translation',
      },
      {
        key: '{measurement:weatherstack.precipitation.description}',
        text: 'Precipitation level (mm)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:weatherstack.snow}',
        text: 'Snow fall',
        __typename: 'Translation',
      },
      {
        key: '{measurement:weatherstack.snow.description}',
        text: 'Snow fall amount (cm)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:weatherstack.sunhours}',
        text: 'Sun hours',
        __typename: 'Translation',
      },
      {
        key: '{measurement:weatherstack.sunhours.description}',
        text: 'Number of sun hours',
        __typename: 'Translation',
      },
      {
        key: '{measurement:weatherstack.moon_illumination}',
        text: 'Moon illumination',
        __typename: 'Translation',
      },
      {
        key: '{measurement:weatherstack.moon_illumination.description}',
        text: 'Moon illumination level (percentage)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.adClicks.description}',
        text: 'Cost to advertiser per click.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.adClicks}',
        text: 'Clicks (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.adCost.description}',
        text: 'Cost for the advertising campaign (currency=AdWords Account)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.adCost}',
        text: 'Ad costs (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.avgPageLoadTime.description}',
        text: 'Average time to load pages on your website (in seconds) ',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.avgPageLoadTime}',
        text: 'Avg. page load time (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.avgSessionDuration.description}',
        text: "Average duration (in seconds) of users' sessions.",
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.avgSessionDuration}',
        text: 'Avg. session duration (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.bounce_rate.description}',
        text: 'Percentage of single-page session, to the total sessions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.bounce_rate}',
        text: 'Bounce rate (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.bounces.description}',
        text: 'Number of single page sessions on your website (no further navigation)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.bounces}',
        text: 'Bounces (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.CPC.description}',
        text: 'Cost per click ',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.CPC}',
        text: 'CPC (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.CPM.description}',
        text: 'Cost per thousand impressions, but not clicks (only ad-shown/display shown)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.CPM}',
        text: 'CPM (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.CTR.description}',
        text: 'Click-through-rate for your ad. Equal to the number of clicks divided by the number of impressions for each ad.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.CTR}',
        text: 'CTR (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.goalCompletions.description}',
        text: 'Goal Completions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.goalCompletions}',
        text: 'Goal completions (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.goalValue.description}',
        text: 'Goal Value',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.goalValue}',
        text: 'Goal value (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.impressions.description}',
        text: 'Amount of Impressions in the given timeframe',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.impressions}',
        text: 'Impressions (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.newUsers.description}',
        text: 'Amount of new Users on your website',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.newUsers}',
        text: 'New users (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.organicSearches.description}',
        text: 'Number of organic searches in a Session',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.organicSearches}',
        text: 'Organic searches (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.percentNewSessions.description}',
        text: 'Of the total sessions, the amount of new ones in %',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.percentNewSessions}',
        text: '% new sessions (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.RPC.description}',
        text: 'Average revenue for each click on one of the search ads',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.RPC}',
        text: 'RPC (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.sessionDuration.description}',
        text: 'Duration all user sessions/time-spent (in seconds)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.sessionDuration}',
        text: 'Session duration (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.sessions.description}',
        text: 'Total amount of sessions on your website',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.sessions}',
        text: 'Sessions (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.sessionsPerUser.description}',
        text: 'Total  of sessions divided by the total number of users.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.sessionsPerUser}',
        text: 'Sessions per user (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.users.description}',
        text: 'Amount of unique-Users on your website',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.users}',
        text: 'Users (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.pageViews.description}',
        text: 'Amount of page views on your website',
        __typename: 'Translation',
      },
      {
        key: '{measurement:website.pageViews}',
        text: 'Page views (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:youtube.annotationClickThroughRate.description}',
        text: 'The ratio of annotations that viewers clicked to the total number of clickable annotation impressions.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:youtube.annotationClickThroughRate}',
        text: 'CTR (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:youtube.annotationCloseRate.description}',
        text: 'The ratio of annotations that viewers closed to the total number of annotation impressions.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:youtube.annotationCloseRate}',
        text: 'Closing rate (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:youtube.averageViewDuration.description}',
        text: 'The average length, in seconds, of video playbacks. ',
        __typename: 'Translation',
      },
      {
        key: '{measurement:youtube.averageViewDuration}',
        text: 'Average view duration (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:youtube.comments.description}',
        text: 'Amount of comments',
        __typename: 'Translation',
      },
      {
        key: '{measurement:youtube.comments}',
        text: 'Comments (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:youtube.dislikes.description}',
        text: 'Amount of dislikes',
        __typename: 'Translation',
      },
      {
        key: '{measurement:youtube.dislikes}',
        text: 'Dislikes (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:youtube.estimatedMinutesWatched.description}',
        text: 'The amount of minutes the video was watched (avg)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:youtube.estimatedMinutesWatched}',
        text: 'Minutes watched (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:youtube.estimatedRevenue.description}',
        text: 'The total estimated net revenue from all Google-sold advertising sources',
        __typename: 'Translation',
      },
      {
        key: '{measurement:youtube.estimatedRevenue}',
        text: 'Revenue (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:youtube.likes.description}',
        text: 'Amount of likes',
        __typename: 'Translation',
      },
      {
        key: '{measurement:youtube.likes}',
        text: 'Likes (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:youtube.shares.description}',
        text: 'Total amount of shares',
        __typename: 'Translation',
      },
      {
        key: '{measurement:youtube.shares}',
        text: 'Shares (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:youtube.subscribersGained.description}',
        text: 'The number of times that users subscribed to a channel.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:youtube.subscribersGained}',
        text: 'Subscribers gained (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:youtube.subscribersLost.description}',
        text: 'The number of times that users unsubscribed from a channel. ',
        __typename: 'Translation',
      },
      {
        key: '{measurement:youtube.subscribersLost}',
        text: 'Subscribers lost (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:youtube.viewerPercentage.description}',
        text: 'The percentage of viewers who were logged in when watching the video or playlist.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:youtube.viewerPercentage}',
        text: 'Logged in viewers (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:youtube.views.description}',
        text: 'The number of times that users unsubscribed from a channel. ',
        __typename: 'Translation',
      },
      {
        key: '{measurement:youtube.views}',
        text: 'Views (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{provider.adition.description}',
        text: 'adition',
        __typename: 'Translation',
      },
      {
        key: '{provider.adition}',
        text: 'adition',
        __typename: 'Translation',
      },
      {
        key: '{provider.adobe.analytics.description}',
        text: 'Adobe Analytics is providing statistics for Website Traffic and analysis. It is the source of this data.',
        __typename: 'Translation',
      },
      {
        key: '{provider.adobe.analytics}',
        text: 'Adobe Analytics',
        __typename: 'Translation',
      },
      {
        key: '{provider.adunittech.description}',
        text: 'Adunit DSP',
        __typename: 'Translation',
      },
      {
        key: '{provider.adunittech}',
        text: 'Adunit DSP',
        __typename: 'Translation',
      },
      {
        key: '{provider.appstore.description}',
        text: 'Browse and download apps to your iPad, iPhone, or iPod touch from the App...',
        __typename: 'Translation',
      },
      {
        key: '{provider.appstore}',
        text: 'Apple App Store',
        __typename: 'Translation',
      },
      {
        key: '{provider.blink.description}',
        text: 'BL.ink is an simple URL shortener, used by major marketing teams around the world.',
        __typename: 'Translation',
      },
      {
        key: '{provider.blink}',
        text: 'BL.ink',
        __typename: 'Translation',
      },
      {
        key: '{provider.exchangeratesapi.description}',
        text: 'Get daily exchange rates for various currencies.',
        __typename: 'Translation',
      },
      {
        key: '{provider.exchangeratesapi}',
        text: 'Exchange Rates',
        __typename: 'Translation',
      },
      {
        key: '{provider.facebook.description}',
        text: 'Connect with friends, family and other people you know. Share...',
        __typename: 'Translation',
      },
      {
        key: '{provider.facebook}',
        text: 'Meta',
        __typename: 'Translation',
      },
      {
        key: '{provider.google.analytics.description}',
        text: 'Google Analytics lets you measure your advertising ROI as well as...',
        __typename: 'Translation',
      },
      {
        key: '{provider.google.analytics}',
        text: 'Google Analytics',
        __typename: 'Translation',
      },
      {
        key: '{provider.google.analytics4.description}',
        text: 'Google Analytics lets you measure your advertising ROI as well as...',
        __typename: 'Translation',
      },
      {
        key: '{provider.google.analytics4}',
        text: 'Google Analytics 4',
        __typename: 'Translation',
      },
      {
        key: '{provider.google.ads.description}',
        text: 'Google Ads is an online advertising platform developed by Google, where advertisers pay...',
        __typename: 'Translation',
      },
      {
        key: '{provider.google.ads}',
        text: 'Google Ads',
        __typename: 'Translation',
      },
      {
        key: '{provider.gplay.description}',
        text: 'Enjoy millions of the latest Android apps, games, music, movies...',
        __typename: 'Translation',
      },
      {
        key: '{provider.gplay}',
        text: 'Google Play Store',
        __typename: 'Translation',
      },
      {
        key: '{provider.hubspot.description}',
        text: 'Hubspot is mainly a Inbound Marketing tool helping you to generate Leads with Content Marketing.',
        __typename: 'Translation',
      },
      {
        key: '{provider.hubspot}',
        text: 'Hubspot',
        __typename: 'Translation',
      },
      {
        key: '{provider.instagram.description}',
        text: 'A simple, fun & creative way to capture, edit & share photos, videos...',
        __typename: 'Translation',
      },
      {
        key: '{provider.instagram}',
        text: 'Instagram (Competitors)',
        __typename: 'Translation',
      },
      {
        key: '{provider.instagramV2.description}',
        text: 'A simple, fun & creative way to capture, edit & share photos, videos...',
        __typename: 'Translation',
      },
      {
        key: '{provider.instagramV2}',
        text: 'Instagram',
        __typename: 'Translation',
      },
      {
        key: '{provider.linkedin.description}',
        text: 'Manage your professional identity. Build and engage with...',
        __typename: 'Translation',
      },
      {
        key: '{provider.linkedin}',
        text: 'Linkedin',
        __typename: 'Translation',
      },
      {
        key: '{provider.mailchimp.description}',
        text: 'Email marketing, ads, landing pages, and automation tools to...',
        __typename: 'Translation',
      },
      {
        key: '{provider.mailchimp}',
        text: 'Mailchimp',
        __typename: 'Translation',
      },
      {
        key: '{provider.mailgun.description}',
        text: 'Powerful Transactional Email APIs that enable you to send...',
        __typename: 'Translation',
      },
      {
        key: '{provider.mailgun}',
        text: 'Mailgun',
        __typename: 'Translation',
      },
      {
        key: '{provider.mandrill.description}',
        text: 'Mandrill is a transactional email platform from Mailchimp.',
        __typename: 'Translation',
      },
      {
        key: '{provider.mandrill}',
        text: 'Mandrill',
        __typename: 'Translation',
      },
      {
        key: '{provider.mailxpert.description}',
        text: 'Newsletter Software developed in Switzerland for SMEs, agencies and...',
        __typename: 'Translation',
      },
      {
        key: '{provider.mailxpert}',
        text: 'MailXpert',
        __typename: 'Translation',
      },
      {
        key: '{provider.pipedrive.description}',
        text: 'Pipedrive in an easy to use CRM system, focussed on sales management.',
        __typename: 'Translation',
      },
      {
        key: '{provider.pipedrive}',
        text: 'Pipedrive',
        __typename: 'Translation',
      },
      {
        key: '{provider.salesforce.description}',
        text: 'Salesforce CRM is the source of this data.',
        __typename: 'Translation',
      },
      {
        key: '{provider.salesforce}',
        text: 'Salesforce',
        __typename: 'Translation',
      },
      {
        key: '{provider.semrush.description}',
        text: 'SEMrush is a powerful and versatile competitive intelligence suite for...',
        __typename: 'Translation',
      },
      {
        key: '{provider.semrush}',
        text: 'Semrush',
        __typename: 'Translation',
      },
      {
        key: '{provider.twitter.description}',
        text: 'Twitter - competitor data provider',
        __typename: 'Translation',
      },
      {
        key: '{provider.twitter}',
        text: 'Twitter (Competitors)',
        __typename: 'Translation',
      },
      {
        key: '{provider.twitterV2.description}',
        text: 'From breaking news and entertainment to sports and politics, get...',
        __typename: 'Translation',
      },
      {
        key: '{provider.twitterV2}',
        text: 'X',
        __typename: 'Translation',
      },
      {
        key: '{provider.thehouse.description}',
        text: 'Marketing planning system of house',
        __typename: 'Translation',
      },
      {
        key: '{provider.thehouse}',
        text: 'House Agency Planner',
        __typename: 'Translation',
      },
      {
        key: '{provider.weatherstack.description}',
        text: 'Subscribe to various weather data for locations across the globe...',
        __typename: 'Translation',
      },
      {
        key: '{provider.weatherstack}',
        text: 'Weather',
        __typename: 'Translation',
      },
      {
        key: '{provider.youtube.description}',
        text: 'Famous video platform Youtube to get all your video-statistics.',
        __typename: 'Translation',
      },
      {
        key: '{provider.youtube}',
        text: 'Youtube',
        __typename: 'Translation',
      },
      {
        key: '{provider.google.searchconsole}',
        text: 'Google Search Console',
        __typename: 'Translation',
      },
      {
        key: '{provider.pinterest.description}',
        text: 'Image sharing and social media service',
        __typename: 'Translation',
      },
      {
        key: '{provider.pinterest}',
        text: 'Pinterest',
        __typename: 'Translation',
      },
      {
        key: '{role:member.description}',
        text: 'Default role for all Team Members',
        __typename: 'Translation',
      },
      {
        key: '{role:member}',
        text: 'Team Member',
        __typename: 'Translation',
      },
      {
        key: '{role:support.description}',
        text: 'Nexoya Support team role',
        __typename: 'Translation',
      },
      {
        key: '{role:support}',
        text: 'Support',
        __typename: 'Translation',
      },
      {
        key: '{role:readonly.description}',
        text: 'Only see teams list',
        __typename: 'Translation',
      },
      {
        key: '{role:readonly}',
        text: 'Read-Only',
        __typename: 'Translation',
      },
      {
        key: '{role:fullaccess.description}',
        text: 'Full access to team features',
        __typename: 'Translation',
      },
      {
        key: '{role:fullaccess}',
        text: 'Full Access',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customkpi}',
        text: 'Custom KPI',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customkpi.description}',
        text: 'Calculated KPI/Index with a selection of metrics.',
        __typename: 'Translation',
      },
      {
        key: '{provider.customkpi}',
        text: 'Custom KPI',
        __typename: 'Translation',
      },
      {
        key: '{provider.customkpi.description}',
        text: "Custom KPI's with predefined calculations such as min,max,sum or avg.",
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.pageViews}',
        text: 'Page views (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.pageViews.description}',
        text: 'Total page views/visitors on this facebook page.',
        __typename: 'Translation',
      },
      {
        key: '{provider.customimport}',
        text: 'Imported',
        __typename: 'Translation',
      },
      {
        key: '{provider.customimport.description}',
        text: 'Manual imported KPIs',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customimport.currency}',
        text: 'Currency',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customimport.currency.description}',
        text: 'Unspecified currency metric',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customimport.percent}',
        text: 'Percent',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customimport.percent.description}',
        text: 'Unspecified percentage metric',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customimport.integer}',
        text: 'Number',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customimport.integer.description}',
        text: 'Unspecified numeric metric',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customimport.second}',
        text: 'Second',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customimport.second.description}',
        text: 'Unspecified time (seconds) metric',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customimport.millisecond}',
        text: 'Millisecond',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customimport.millisecond.description}',
        text: 'Unspecified time (Milliseconds) metric',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customimport.impressions}',
        text: 'Impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customimport.impressions.description}',
        text: 'Impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customimport.clicks}',
        text: 'Clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customimport.clicks.description}',
        text: 'Clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customimport.conversions}',
        text: 'Conversions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customimport.conversions.description}',
        text: 'Conversions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customimport.addtocarts}',
        text: 'Add to Carts',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customimport.addtocarts.description}',
        text: 'Add to Carts',
        __typename: 'Translation',
      },
      {
        key: '{provider.sap.mc}',
        text: 'SAP Marketing Cloud',
        __typename: 'Translation',
      },
      {
        key: '{provider.sap.mc.description}',
        text: 'SAP Marketing Cloud',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailBlocked}',
        text: 'Blocked emails (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailBlocked.description}',
        text: 'Number of times your emails got blocked',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailBounceHard}',
        text: 'Hard Bounces (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailBounceHard.description}',
        text: 'Hard bounce of your emails',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailBounceSoft}',
        text: 'Soft Bounces (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailBounceSoft.description}',
        text: 'Soft bounce of your emails',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailComplaint}',
        text: 'Complained emails (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailComplaint.description}',
        text: 'Amount of email complained',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailFailed}',
        text: 'Failed Delivery (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailFailed.description}',
        text: 'Number of failed emails',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailInbound}',
        text: 'Received emails (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailInbound.description}',
        text: 'Emails received from users outside of your organization',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailOutbound}',
        text: 'Sent emails (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailOutbound.description}',
        text: 'Emails sent to users outside of your organization',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailOutboundFailed}',
        text: 'Failed Delivery (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailOutboundFailed.description}',
        text: 'Amount of failed emails sending/deliveries',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailClicked}',
        text: 'Clicks (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailClicked.description}',
        text: 'Number of clicks on links in your emails content',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailOpened}',
        text: 'Opened (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailOpened.description}',
        text: 'Amount of opened emails',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.newsletterSubscr}',
        text: 'Subscribes (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.newsletterSubscr.description}',
        text: 'Amount of subscribers of your target group/newsletter',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.newsletterUnsubscr}',
        text: 'Unsubscribes (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.newsletterUnsubscr.description}',
        text: 'Amount of unsubscribes of your target group/newsletter',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.marketingLead}',
        text: 'Leads (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.marketingLead.description}',
        text: 'Total amount of new marketing leads',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.offerClick}',
        text: 'Offer clicks (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.offerClick.description}',
        text: 'Amount of clicks on your offers',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.offerDisplay}',
        text: 'Offer displays (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.offerDisplay.description}',
        text: 'Amount of displays of your offers',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.clickTrough}',
        text: 'Click through (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.clickTrough.description}',
        text: 'Click troughs from your emails',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.TargetGroupMemberCount}',
        text: 'Subscribers / Members (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.TargetGroupMemberCount.description}',
        text: 'Total member count of your target group',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailBounceRate}',
        text: 'Bounce rate (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailBounceRate.description}',
        text: 'Bounce rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailCTOR}',
        text: 'Click-To-Open rate (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailCTOR.description}',
        text: 'The number of unique clicks devided by the opened messages',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailCTR}',
        text: 'CTR (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailCTR.description}',
        text: 'Click-Trough rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailDelivered}',
        text: 'Delivered emails (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailDelivered.description}',
        text: 'Number of successfully sent messages minus the bounces',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailOpenRate}',
        text: 'Open rate (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailOpenRate.description}',
        text: 'Open rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailUniqueCTR}',
        text: 'Unique CTR (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailUniqueCTR.description}',
        text: 'Unique Click-Trough rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailUniqueClickTrough}',
        text: 'Unique click troughs (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:sap.mc.emailUniqueClickTrough.description}',
        text: 'Unique Click trough',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.engagements}',
        text: 'Engagements (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.engagements.description}',
        text: 'Total number of engagements',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.impressions}',
        text: 'Impressions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.impressions.description}',
        text: 'Total number of impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.retweets}',
        text: 'Retweets (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.retweets.description}',
        text: 'Total number of retweets',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.replies}',
        text: 'Replies (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.replies.description}',
        text: 'Total number of replies',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.likes}',
        text: 'Likes (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.likes.description}',
        text: 'Total number of likes',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.follows}',
        text: 'Follows (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.follows.description}',
        text: 'Total number of follows',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.clicks}',
        text: 'Clicks (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.clicks.description}',
        text: 'Total number of clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.app_clicks}',
        text: 'App clicks (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.app_clicks.description}',
        text: 'Total number of app clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.url_clicks}',
        text: 'Link clicks (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.url_clicks.description}',
        text: 'Total number of link clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.billed_engagements}',
        text: 'Billed engagements (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.billed_engagements.description}',
        text: 'Total number of billed engagements (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.billed_charge_local_micro}',
        text: 'Total spend (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.billed_charge_local_micro.description}',
        text: 'Total spend',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.video_total_views}',
        text: 'Video views (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.video_total_views.description}',
        text: 'Total number of video views',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.video_cta_clicks}',
        text: 'Video cta clicks (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.video_cta_clicks.description}',
        text: 'Total clicks on the call to action',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.video_content_starts}',
        text: 'Video content starts (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.video_content_starts.description}',
        text: 'Total number of video playback starts',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.media_views}',
        text: 'Media views (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.media_views.description}',
        text: 'Total number of views (autoplay and click) of media across Videos, Vines, GIFs, and Images',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.media_engagements}',
        text: 'Media engagements (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.media_engagements.description}',
        text: 'Total number of clicks of media across Videos, Vines, GIFs, and Images',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.conversion_site_visits}',
        text: 'Conversion site visits (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.conversion_site_visits.description}',
        text: 'Conversion site visits',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.conversion_sign_ups}',
        text: 'Conversion sign ups (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.conversion_sign_ups.description}',
        text: 'Conversion sign ups',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.conversion_custom}',
        text: 'Custom conversions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.conversion_custom.description}',
        text: 'The Custom Conversions defined by the advertiser.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.conversion_purchases}',
        text: 'Purchases conversions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.conversion_purchases.description}',
        text: 'The Purchases Conversions defined by the advertiser.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.reach}',
        text: 'Reach (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.ads.reach.description}',
        text: 'The number of people who saw your ads at least once',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.organic.clicks}',
        text: 'Clicks (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.organic.clicks.description}',
        text: 'Total number of clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.organic.engagements}',
        text: 'Engagements (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.organic.engagements.description}',
        text: 'Total number of engagements',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.organic.impressions}',
        text: 'Impressions (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.organic.impressions.description}',
        text: 'Total number of impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.organic.likes}',
        text: 'Likes (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.organic.likes.description}',
        text: 'Total number of likes',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.organic.replies}',
        text: 'Replies (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.organic.replies.description}',
        text: 'Total number of replies',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.organic.retweets}',
        text: 'Retweets (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.organic.retweets.description}',
        text: 'Total number of retweets',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.organic.video_content_starts}',
        text: 'Video content starts (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.organic.video_content_starts.description}',
        text: 'Total number of video playback starts',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.organic.video_total_views}',
        text: 'Video views (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.organic.video_total_views.description}',
        text: 'Total number of video views',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.organic.follows}',
        text: 'Follows (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:twitterV2.organic.follows.description}',
        text: 'Total number of follows',
        __typename: 'Translation',
      },
      {
        key: '{provider.salesforce.salescloud}',
        text: 'Salesforce Sales Cloud',
        __typename: 'Translation',
      },
      {
        key: '{provider.salesforce.salescloud.description}',
        text: 'Salesforce Sales Cloud is a customer relationship management (CRM) platform designed to support sales, marketing and customer support.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:salesforce.salescloud.count}',
        text: 'Total count (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:salesforce.salescloud.count.description}',
        text: 'Total count of the entity',
        __typename: 'Translation',
      },
      {
        key: '{measurement:salesforce.salescloud.dailyCount}',
        text: 'Daily count (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:salesforce.salescloud.dailyCount.description}',
        text: 'Daily count of the entity',
        __typename: 'Translation',
      },
      {
        key: '{measurement:salesforce.salescloud.amount}',
        text: 'Currency amount (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:salesforce.salescloud.amount.description}',
        text: 'Currency amount of the entity',
        __typename: 'Translation',
      },
      {
        key: '{provider.salesforce.marketingcloud}',
        text: 'Salesforce Marketing Cloud',
        __typename: 'Translation',
      },
      {
        key: '{provider.salesforce.marketingcloud.description}',
        text: 'Salesforce Marketing Cloud is a provider of digital marketing automation and analytics software and services.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:salesforce.marketingcloud.UniqueClicks.description}',
        text: 'Total amount of Unique Clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:salesforce.marketingcloud.UniqueOpens.description}',
        text: 'Total amount of Unique Opens',
        __typename: 'Translation',
      },
      {
        key: '{measurement:salesforce.marketingcloud.NumberSent.description}',
        text: 'Total amount of NumberSent',
        __typename: 'Translation',
      },
      {
        key: '{measurement:salesforce.marketingcloud.Unsubscribes.description}',
        text: 'Total amount of Unsubscribes',
        __typename: 'Translation',
      },
      {
        key: '{measurement:salesforce.marketingcloud.Subscribes.description}',
        text: 'Total amount of Subscribes',
        __typename: 'Translation',
      },
      {
        key: '{measurement:salesforce.marketingcloud.Bounces.description}',
        text: 'Total amount of Bounces',
        __typename: 'Translation',
      },
      {
        key: '{measurement:salesforce.marketingcloud.UniqueClicks}',
        text: 'Unique clicks (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:salesforce.marketingcloud.UniqueOpens}',
        text: 'Unique opens (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:salesforce.marketingcloud.NumberSent}',
        text: 'NumberSent (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:salesforce.marketingcloud.Unsubscribes}',
        text: 'Unsubscribes (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:salesforce.marketingcloud.Subscribes}',
        text: 'Subscribes (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:salesforce.marketingcloud.Bounces}',
        text: 'Bounces (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:thehouse.CPM}',
        text: 'CPM (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:thehouse.CPM.description}',
        text: 'Cost per Thousand - Impression',
        __typename: 'Translation',
      },
      {
        key: '{measurement:google.searchconsole.clicks}',
        text: 'Clicks (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:google.searchconsole.clicks.description}',
        text: 'Clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:google.searchconsole.ctr}',
        text: 'CTR (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:google.searchconsole.ctr.description}',
        text: 'Click-through Rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:google.searchconsole.impressions}',
        text: 'Impressions (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:google.searchconsole.impressions.description}',
        text: 'Impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:google.searchconsole.position}',
        text: 'Position (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:google.searchconsole.position.description}',
        text: 'Average position in search results',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customkpi.avg}',
        text: 'Custom KPI (average)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customkpi.avg.description}',
        text: 'Calculated KPI/Index with a selection of metrics (average).',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customkpi.total}',
        text: 'Custom KPI (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customkpi.total.description}',
        text: 'Calculated KPI/Index with a selection of metrics (paid & organic).',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.submissions}',
        text: 'Submissions (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.submissions.description}',
        text: 'Number of submissions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.rawViews}',
        text: 'Page Views (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.rawViews.description}',
        text: 'Views/Impressions on your page/blog',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.entrances}',
        text: 'Entrances (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.entrances.description}',
        text: 'The number of sessions that started with viewing this page first',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.exits}',
        text: 'Exits (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.exits.description}',
        text: 'The number of sessions that ended with viewing this page last',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.pageTime}',
        text: 'Time on page (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.pageTime.description}',
        text: 'The average amount of time a visitor stays',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.timePerPageview}',
        text: 'Time per page (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.timePerPageview.description}',
        text: 'Amount of time on your Page/Blog (in seconds)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.exitsPerPageview}',
        text: 'Exits per pageview (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.exitsPerPageview.description}',
        text: 'The percentage of sessions that ended with viewing this page last',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.pageBounceRate}',
        text: 'Bounce rate (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.pageBounceRate.description}',
        text: 'Amount of bounces per visit',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.lifecycle.count}',
        text: 'Lifecycle count',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.lifecycle.count.description}',
        text: 'Lifecycle count',
        __typename: 'Translation',
      },
      {
        key: '{provider.gotowebinar.description}',
        text: 'Present to hundreds with confidence and attend a webinar from anywhere.',
        __typename: 'Translation',
      },
      {
        key: '{provider.gotowebinar}',
        text: 'GoToWebinar',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gotowebinar.registrantsAttended}',
        text: 'Number of Attendees',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gotowebinar.registrantsAttended.description}',
        text: 'Number of Attendees',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gotowebinar.registrantCount}',
        text: 'Number of Registrants',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gotowebinar.registrantCount.description}',
        text: 'Number of Registrants',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gotowebinar.percentageAttendance}',
        text: 'Calculated Attendance Rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gotowebinar.percentageAttendance.description}',
        text: 'Calculated Attendance Rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gotowebinar.averageAttentiveness}',
        text: 'Average Attentiveness',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gotowebinar.averageAttentiveness.description}',
        text: 'Average Attentiveness',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gotowebinar.questionsAsked}',
        text: 'Number of Questions asked during the webinar',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gotowebinar.questionsAsked.description}',
        text: 'Number of Questions asked during the webinar',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gotowebinar.pollCount}',
        text: 'Number of poll results',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gotowebinar.pollCount.description}',
        text: 'Number of poll results',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gotowebinar.surveyCount}',
        text: 'Number of poll survey results',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gotowebinar.surveyCount.description}',
        text: 'Number of poll survey results',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gotowebinar.percentagePollsCompleted}',
        text: 'Percentage of poll results',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gotowebinar.percentagePollsCompleted.description}',
        text: 'Percentage of poll results',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gotowebinar.percentageSurveysCompleted}',
        text: 'Percentage of poll survey results',
        __typename: 'Translation',
      },
      {
        key: '{measurement:gotowebinar.percentageSurveysCompleted.description}',
        text: 'Percentage of poll survey results',
        __typename: 'Translation',
      },
      {
        key: '{provider.googledcm.description}',
        text: 'Google DoubleClick for Advertisers.',
        __typename: 'Translation',
      },
      {
        key: '{provider.googledcm}',
        text: 'Google DCM',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.clicks}',
        text: 'Clicks (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.clicks.description}',
        text: 'Clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.clickRate}',
        text: 'Click Rate (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.clickRate.description}',
        text: 'Click Rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.impressions}',
        text: 'Impressions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.impressions.description}',
        text: 'Impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.downloadedImpressions}',
        text: 'Downloaded Impressions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.downloadedImpressions.description}',
        text: 'Downloaded Impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.costPerActivity}',
        text: 'Cost Per Activity (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.costPerActivity.description}',
        text: 'Cost Per Activity',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.costPerClick}',
        text: 'Cost Per Click (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.costPerClick.description}',
        text: 'Cost Per Click',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.costPerRevenue}',
        text: 'Cost Per Revenue (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.costPerRevenue.description}',
        text: 'Cost Per Revenue',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.dbmCostAccountCurrency}',
        text: 'DBM Cost (Account Currency)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.dbmCostAccountCurrency.description}',
        text: 'DBM Cost (Account Currency)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.dbmCostUsd}',
        text: 'DBM Cost USD (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.dbmCostUsd.description}',
        text: 'DBM Cost USD',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.effectiveCpm}',
        text: 'Effective CPM (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.effectiveCpm.description}',
        text: 'Effective CPM',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.mediaCost}',
        text: 'Media Cost',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.mediaCost.description}',
        text: 'Media Cost',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.revenuePerClick}',
        text: 'Revenue Per Click (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.revenuePerClick.description}',
        text: 'Revenue Per Click',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.revenuePerThousandImpressions}',
        text: 'Revenue Per Thousand Impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.revenuePerThousandImpressions.description}',
        text: 'Revenue Per Thousand Impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.totalConversions}',
        text: 'Total Conversions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.totalConversions.description}',
        text: 'Total Conversions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.totalRevenue}',
        text: 'Total Revenue (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.totalRevenue.description}',
        text: 'Total Revenue',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.activityViewThroughConversions}',
        text: 'View-through Conversions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.activityViewThroughConversions.description}',
        text: 'View-through Conversions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.activeViewViewableImpressions}',
        text: 'Active View: Viewable Impressions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.activeViewViewableImpressions.description}',
        text: 'Active View: Viewable Impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.activeViewMeasurableImpressions}',
        text: 'Active View: Measurable Impressions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.activeViewMeasurableImpressions.description}',
        text: 'Active View: Measurable Impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.richMediaVideoCompletions}',
        text: 'Video Completions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledcm.richMediaVideoCompletions.description}',
        text: 'Video Completions',
        __typename: 'Translation',
      },
      {
        key: '{provider.googledv360.description}',
        text: 'Google Display & Video for Advertisers.',
        __typename: 'Translation',
      },
      {
        key: '{provider.googledv360}',
        text: 'Google Display & Video',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledv360.billableImpressions}',
        text: 'Billable Impressions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledv360.billableImpressions.description}',
        text: 'Billable Impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledv360.clicks}',
        text: 'Clicks (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledv360.clicks.description}',
        text: 'Clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledv360.impressions}',
        text: 'Impressions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledv360.impressions.description}',
        text: 'Impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledv360.mediaCost}',
        text: 'Media Cost (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledv360.mediaCost.description}',
        text: 'Media Cost - Advertiser Currency ',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledv360.totalMediaCost}',
        text: 'Total Media Cost (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledv360.totalMediaCost.description}',
        text: 'Total Media Cost - Advertiser Currency ',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledv360.postClickConversions}',
        text: 'Post-Click Conversions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledv360.postClickConversions.description}',
        text: 'Post-Click Conversions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledv360.postViewConversions}',
        text: 'Post-View Conversions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledv360.postViewConversions.description}',
        text: 'Post-View Conversions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledv360.revenueAdvertiser}',
        text: 'Revenue (Advertiser Currency) (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledv360.revenueAdvertiser.description}',
        text: 'Revenue (Advertiser Currency)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledv360.revenueAdvertiserUSD}',
        text: 'Revenue (USD) (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledv360.revenueAdvertiserUSD.description}',
        text: 'Revenue (USD)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledv360.totalConversions}',
        text: 'Total Conversions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledv360.totalConversions.description}',
        text: 'Total Conversions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.impressions}',
        text: 'Impressions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.impressions.description}',
        text: 'Impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.clicks}',
        text: 'Clicks (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.clicks.description}',
        text: 'Clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.ctr}',
        text: 'CTR (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.ctr.description}',
        text: 'Click-trough rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.averageCpc}',
        text: 'Average CPC (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.averageCpc.description}',
        text: 'Average cost per click',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.spend}',
        text: 'Spend (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.spend.description}',
        text: 'Spend',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.averagePosition}',
        text: 'Average Position (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.averagePosition.description}',
        text: 'Average Position',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.conversions}',
        text: 'Conversions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.conversions.description}',
        text: 'Conversions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.conversionRate}',
        text: 'Conversion Rate (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.conversionRate.description}',
        text: 'Conversion Rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.revenue}',
        text: 'Revenue (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.revenue.description}',
        text: 'Revenue',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.allConversions}',
        text: 'All Conversions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.allConversions.description}',
        text: 'All Conversions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.goal}',
        text: 'Goal (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.goal.description}',
        text: 'Conversion goal',
        __typename: 'Translation',
      },
      {
        key: '{provider.bing.description}',
        text: 'Bing is a web search engine owned and operated by Microsoft.',
        __typename: 'Translation',
      },
      {
        key: '{provider.bing}',
        text: 'Microsoft Bing',
        __typename: 'Translation',
      },
      {
        key: '{provider.taboola.description}',
        text: 'Taboola is a content discovery and native advertising platform.',
        __typename: 'Translation',
      },
      {
        key: '{provider.taboola}',
        text: 'Taboola',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.numberOfDeals.description}',
        text: 'Total number of deals within hubspot',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.numberOfDeals}',
        text: 'Deals',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.numberOfDealConversions.description}',
        text: 'Total number of deal conversions within hubspot',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.numberOfDealConversions}',
        text: 'Deal Conversions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.newContacts.description}',
        text: 'Total number of new contacts within hubspot',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.newContacts}',
        text: 'New Contacts',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.member_count.description}',
        text: 'Total number of subscribers',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mail.member_count}',
        text: 'Subscribers',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.contactsPerList.description}',
        text: 'Number of contacts in a list',
        __typename: 'Translation',
      },
      {
        key: '{measurement:hubspot.contactsPerList}',
        text: 'List Contacts',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.impressionSharePercent}',
        text: 'Impression share (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.impressionSharePercent.description}',
        text: 'The estimated percentage of impressions, out of the total available impressions in the market you were targeting.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.absoluteImpressionSharePercent}',
        text: 'Absolute impression share (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.absoluteImpressionSharePercent.description}',
        text: 'The estimated percentage of times your ad was in the first position of all results, out of the estimated number of first position impressions you were eligible to receive.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.qualityScore}',
        text: 'Quality score (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.qualityScore.description}',
        text: 'The quality of your keywords, ads, and landing pages, which helps you understand how competitive your ads are in the marketplace.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.returnOnAdSpend}',
        text: 'ROAS (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.returnOnAdSpend.description}',
        text: 'Return on ad spend',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.clickSharePercent}',
        text: 'Click share (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.clickSharePercent.description}',
        text: 'The estimated clicks your ad received, as a percentage of the total number of clicks available in auctions your ad showed in or was competitive in.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customimport.viewableImpressions}',
        text: 'Viewable impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customimport.viewableImpressions.description}',
        text: 'Viewable impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customimport.videoCompletions}',
        text: 'Video completions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customimport.videoCompletions.description}',
        text: 'Video completions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.videoP100WatchedActions}',
        text: 'Video completions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.videoP100WatchedActions.description}',
        text: 'The number of times your video was played at 100% of its length.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.leads.description}',
        text: 'Facebook leads.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.leads}',
        text: 'Leads',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adunittech.budget_spent_delta.description}',
        text: 'Delta planned/spent (Pacing)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:adunittech.budget_spent_delta}',
        text: 'Delta planned/spent (Pacing)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledv360.activeViewPercentageOfCompletedImpressionsVisible}',
        text: 'Active View: % of Completed Impressions Visible',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledv360.activeViewPercentageOfCompletedImpressionsVisible.description}',
        text: 'Active View: % of Completed Impressions Visible',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledv360.activeViewPercentageViewavleImpressions}',
        text: 'Active View: % Viewable Impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledv360.activeViewPercentageViewavleImpressions.description}',
        text: 'Active View: % Viewable Impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledv360.activeViewViewableImpressions}',
        text: 'Active View: Viewable Impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledv360.activeViewViewableImpressions.description}',
        text: 'Active View: Viewable Impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledv360.completedViews}',
        text: 'Complete Views (Video)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googledv360.completedViews.description}',
        text: 'Complete Views (Video)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.allRevenuePerConversion}',
        text: 'All revenue per conversion',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.allRevenuePerConversion.description}',
        text: 'All revenue per conversion',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.revenuePerConversion}',
        text: 'Revenue per conversion',
        __typename: 'Translation',
      },
      {
        key: '{measurement:bing.revenuePerConversion.description}',
        text: 'Revenue per conversion',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.lifetime_budget_remaining}',
        text: 'Lifetime budget left',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.lifetime_budget_remaining.description}',
        text: 'Lifetime budget left',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customimport.conversionValue}',
        text: 'Conversion Value',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customimport.conversionValue.description}',
        text: 'Conversion Value',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ecommerce.transactions.description}',
        text: 'Total measured E-Commerce Transactions (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ecommerce.transactions}',
        text: 'E-commerce transactions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customimport.engagement.description}',
        text: 'Total imported engagements & interactions (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customimport.engagement}',
        text: 'Engagements/Interactions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customimport.sessions.description}',
        text: 'Total imported Sessions or Page Views (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:customimport.sessions}',
        text: 'Sessions/Page Views',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.engagement}',
        text: 'Engagement (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.engagement.description}',
        text: 'Any activity in which a user interacts with one of your Pins. This includes saves, Pin clicks, and outbound clicks, and carousel card swipes',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.engagement_rate}',
        text: 'Engagement Rate (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.engagement_rate.description}',
        text: 'The total engagements with your Pins divided by the total number of times your Pins were seen',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.impression}',
        text: 'Impressions (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.impression.description}',
        text: 'The number of times your Pins or ads were on screen',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.outbound_click}',
        text: 'Outbound clicks (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.outbound_click.description}',
        text: 'The number of times people perform actions that lead them to a destination off Pinterest',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.outbound_click_rate}',
        text: 'Outbound click rate (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.outbound_click_rate.description}',
        text: 'The total number of clicks to the destination URL associated with your Pi divided by the total number of times your Pins were on screen',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.pin_click}',
        text: 'Pin clicks (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.pin_click.description}',
        text: 'The total number of clicks on your Pin or ad to content on or off of Pinterest',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.pin_click_rate}',
        text: 'Pin click rate (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.pin_click_rate.description}',
        text: 'The total number of clicks on your Pin or ad to content on or off Pinterest divided by the total number of times your Pins or ads were on screen',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.save}',
        text: 'Saves (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.save.description}',
        text: 'The number of times people saved your video Pin to a board',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.save_rate}',
        text: 'Save rate (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.save_rate.description}',
        text: 'The total saves of your Pins divided by the total number of times your Pins were on screen',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.impression_1}',
        text: 'Impressions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.impression_1.description}',
        text: 'The number of times your ads were on screen',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.impression_2}',
        text: 'Impressions (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.impression_2.description}',
        text: 'The number of times your pins were on screen',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.clickthrough_1}',
        text: 'Clicks (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.clickthrough_1.description}',
        text: 'The total number of clicks your ad received',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.clickthrough_2}',
        text: 'Clicks (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.clickthrough_2.description}',
        text: 'The total number of clicks your pin received',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.cpc_in_micro_dollar}',
        text: 'CPC micros (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.cpc_in_micro_dollar.description}',
        text: 'The Cost-per-click in micro dollars',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.cpm_in_micro_dollar}',
        text: 'CPM micros (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.cpm_in_micro_dollar.description}',
        text: 'The Cost-per thousand impressions in micro dollars',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.ctr}',
        text: 'CTR (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.ctr.description}',
        text: 'The click-through rate on paid ads',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.engagement_1}',
        text: 'Engagement (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.engagement_1.description}',
        text: 'Any activity in which a user interacts with one of your ads',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.engagement_2}',
        text: 'Engagement (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.engagement_2.description}',
        text: 'Any activity in which a user interacts with one of your pins',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.page_visit_roas}',
        text: 'Page visit ROAS (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.page_visit_roas.description}',
        text: 'The total return on ad spend for each page visit',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.paid_impression}',
        text: 'Impressions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.paid_impression.description}',
        text: 'The number of times your ads were on screen',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.spend_in_micro_dollar}',
        text: 'Spend micros (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.spend_in_micro_dollar.description}',
        text: 'The total amount spent on ad campaigns, in the currency specified in the advertisers profile',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.total_conversions}',
        text: 'Conversions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.total_conversions.description}',
        text: 'The total number of conversions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.total_lead}',
        text: 'Leads (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.total_lead.description}',
        text: 'The total number of leads',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.total_engagement}',
        text: 'Total engagement (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.total_engagement.description}',
        text: 'The total number of engagement',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.total_page_visit}',
        text: 'Total page visits (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.total_page_visit.description}',
        text: 'The total number of page visits',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.spend_in_dollar}',
        text: 'Spend (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.spend_in_dollar.description}',
        text: "The total spendings in the advertiser's currency",
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.outbound_click_organic}',
        text: 'Outbound clicks (organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.outbound_click_organic.description}',
        text: 'Outbound clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.outbound_click_paid}',
        text: 'Outbound clicks (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.outbound_click_paid.description}',
        text: 'Outbound clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.total_click_checkout}',
        text: 'Total clicks conversions (checkout)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.total_click_checkout.description}',
        text: 'Checkout clicks conversions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.total_click_checkout_value}',
        text: 'Total clicks order value micros (checkout)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.total_click_checkout_value.description}',
        text: 'Checkout clicks order value micros',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.total_video_p95_combined}',
        text: 'Video played at 95% (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:pinterest.total_video_p95_combined.description}',
        text: 'Paid video played at 95%',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.clicks}',
        text: 'Clicks (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.clicks.description}',
        text: 'Total clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.impressions}',
        text: 'Impressions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.impressions.description}',
        text: 'Total impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.visible_impressions}',
        text: 'Viewable impressions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.visible_impressions.description}',
        text: 'Total viewable impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.spent}',
        text: 'Spend (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.spent.description}',
        text: 'Total spendings',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.conversions_value}',
        text: 'Conversion value (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.conversions_value.description}',
        text: 'Total revenue from conversions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.conversion_rules_conversions}',
        text: 'Total conversions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.conversion_rules_conversions.description}',
        text: 'Total conversions per conversion rule',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.roas}',
        text: 'ROAS (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.roas.description}',
        text: 'Return On Ad Spend',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.ctr}',
        text: 'CTR (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.ctr.description}',
        text: 'Click Through Rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.vctr}',
        text: 'VCTR (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.vctr.description}',
        text: 'Viewable Click Through Rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.cpm}',
        text: 'CPM (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.cpm.description}',
        text: 'Cost Per 1000 Impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.vcpm}',
        text: 'VCPM (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.vcpm.description}',
        text: 'Cost Per 1000 Viewable Impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.cpc}',
        text: 'CPC (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.cpc.description}',
        text: 'Cost Per Click',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.campaigns_num}',
        text: 'Num campaigns (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.campaigns_num.description}',
        text: 'Number of campaigns',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.cpa}',
        text: 'CPA (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.cpa.description}',
        text: 'Cost Per Action',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.cpa_clicks}',
        text: 'CPA clicks (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.cpa_clicks.description}',
        text: 'Click Cost Per Action',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.cpa_clicks}',
        text: 'CPA clicks (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.cpa_clicks.description}',
        text: 'Click Cost Per Action',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.cpa_views}',
        text: 'CPA views (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.cpa_views.description}',
        text: 'View Cost Per Action',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.cpa_actions_num}',
        text: 'Conversions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.cpa_actions_num.description}',
        text: 'Total number of conversions (actions)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.cpa_actions_num_from_clicks}',
        text: 'Click-trough conversions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.cpa_actions_num_from_clicks.description}',
        text: 'Total number of click-through conversions (actions)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.cpa_actions_num_from_views}',
        text: 'View-trough conversions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.cpa_actions_num_from_views.description}',
        text: 'Total number of view-through conversions (actions)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.cpa_conversion_rate}',
        text: 'Conversion rate (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.cpa_conversion_rate.description}',
        text: 'Conversion rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.cpa_conversion_rate_clicks}',
        text: 'Click conversion rate (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.cpa_conversion_rate_clicks.description}',
        text: 'Click conversion rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.cpa_conversion_rate_views}',
        text: 'View conversion rate (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:taboola.cpa_conversion_rate_views.description}',
        text: 'View conversion rate',
        __typename: 'Translation',
      },
      {
        key: '{provider.siteimprove.description}',
        text: 'Siteimprove is a platform for website optimization.',
        __typename: 'Translation',
      },
      {
        key: '{provider.siteimprove}',
        text: 'Siteimprove',
        __typename: 'Translation',
      },
      {
        key: '{measurement:siteimprove.qa_score}',
        text: 'QA score (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:siteimprove.qa_score.description}',
        text: 'Quality Assurance score',
        __typename: 'Translation',
      },
      {
        key: '{measurement:siteimprove.accessibility_score}',
        text: 'Accessability score (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:siteimprove.accessibility_score.description}',
        text: 'Accessability score',
        __typename: 'Translation',
      },
      {
        key: '{measurement:siteimprove.dci_score}',
        text: 'DCI score (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:siteimprove.dci_score.description}',
        text: 'Digital Certainty Index score',
        __typename: 'Translation',
      },
      {
        key: '{measurement:siteimprove.seo_score}',
        text: 'SEO score (paid & organic)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:siteimprove.seo_score.description}',
        text: 'Search Engine Optimization score',
        __typename: 'Translation',
      },
      {
        key: '{provider.mediamath}',
        text: 'MediaMath',
        __typename: 'Translation',
      },
      {
        key: '{provider.mediamath.description}',
        text: 'The MediaMath Platform empowers brands and agencies to take control of their marketing today and operate with flexibility to deliver efficient and effective omnichannel campaigns into the future.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mediamath.clicks}',
        text: 'Clicks (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mediamath.clicks.description}',
        text: 'The number of clicks.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mediamath.ctr}',
        text: 'CTR (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mediamath.ctr.description}',
        text: 'Click-through Rate in %',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mediamath.impressions}',
        text: 'Impressions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mediamath.impressions.description}',
        text: 'Impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mediamath.total_conversions}',
        text: 'Conversions (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mediamath.total_conversions.description}',
        text: 'The total amout of conversions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mediamath.total_revenue}',
        text: 'Revenue (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mediamath.total_revenue.description}',
        text: 'Total Revenue',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mediamath.total_spend}',
        text: 'Spend (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mediamath.total_spend.description}',
        text: 'Total Spend',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mediamath.total_spend_cpa}',
        text: 'CPA (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mediamath.total_spend_cpa.description}',
        text: 'Cost Per Action',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mediamath.total_spend_cpc}',
        text: 'CPC (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mediamath.total_spend_cpc.description}',
        text: 'Cost Per Click',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mediamath.total_spend_cpm}',
        text: 'CPM (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mediamath.total_spend_cpm.description}',
        text: 'Cost Per 1000 Impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mediamath.total_spend_roi}',
        text: 'ROI (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:mediamath.total_spend_roi.description}',
        text: 'Return of investment',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.landing_page_view}',
        text: 'Landing page views',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.landing_page_view.description}',
        text: 'The number of times that a person clicked on an ad link and successfully loaded the destination web page, Instant Experience or Meta shop. To see reporting on landing page views for destination web pages or Instant Experiences, you need to have a Meta pixel installed.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.all_conversions_value_per_cost}',
        text: 'ROAS (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.all_conversions_value_per_cost.description}',
        text: 'Return on ad spend',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.action_pixel_complete_registration}',
        text: 'Conversions - Complete Registration (paid)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.action_pixel_complete_registration.description}',
        text: 'The number of complete registration events tracked by the pixel on your website',
        __typename: 'Translation',
      },
      {
        key: '{provider.tiktokV1}',
        text: 'TikTok',
        __typename: 'Translation',
      },
      {
        key: '{provider.tiktokV1.description}',
        text: 'TikTok is a social media platform for creating, sharing and discovering short videos',
        __typename: 'Translation',
      },
      {
        key: '{provider.reddit}',
        text: 'Reddit',
        __typename: 'Translation',
      },
      {
        key: '{provider.reddit.description}',
        text: 'Reddit for advertisement',
        __typename: 'Translation',
      },
      {
        key: '{provider.outbrain}',
        text: 'Outbrain',
        __typename: 'Translation',
      },
      {
        key: '{provider.outbrain.description}',
        text: 'Outbrain is a recommendation platform powered by native ads',
        __typename: 'Translation',
      },
      {
        key: '{provider.outbrain.logoAlt}',
        text: 'Outbrain logo',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.roas}',
        text: 'ROAS',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.roas.description}',
        text: 'Return On Ad Spend is your total conversion value attributed to clicks, divided by spend (sumValue / spend).',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.totalRoas}',
        text: 'Total ROAS',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.totalRoas.description}',
        text: 'Total Return On Ad Spend is your total conversion value attributed to clicks or views, divided by spend (totalSumValue / spend).',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.impressions}',
        text: 'Impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.impressions.description}',
        text: 'Total number of PromotedLinks impressions.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.clicks}',
        text: 'Clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.clicks.description}',
        text: 'Total PromotedLinks clicks.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.ctr}',
        text: 'CTR',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.ctr.description}',
        text: 'Click Through Rate (clicks / impressions)*100).',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.spend}',
        text: 'Spend',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.spend.description}',
        text: 'The total amount of money spent.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.ecpc}',
        text: 'CPC',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.ecpc.description}',
        text: 'Effective Cost per Click (spend / clicks).',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.totalConversions}',
        text: 'Total conversions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.totalConversions.description}',
        text: 'The total number of conversions.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.conversions}',
        text: 'Conversions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.conversions.description}',
        text: 'The total number of conversions from clicks.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.viewConversions}',
        text: 'View conversions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.viewConversions.description}',
        text: 'The total number of view-through conversions.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.conversionRate}',
        text: 'Conversion rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.conversionRate.description}',
        text: 'The average rate of conversions from clicks (conversions / clicks)*100).',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.viewConversionRate}',
        text: 'View conversion rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.viewConversionRate.description}',
        text: 'The average rate of view-through conversions per viewable impression (percentage).',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.cpa}',
        text: 'CPA',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.cpa.description}',
        text: 'Cost Per Acquisition from clicks (spend / conversions).',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.totalCpa}',
        text: 'Total CPA',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.totalCpa.description}',
        text: 'The average Cost Per Acquisition calculated for all conversions (spend / totalConversions).',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.totalSumValue}',
        text: 'Total sum value',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.totalSumValue.description}',
        text: 'The total amount of money reported for all conversions.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.sumValue}',
        text: 'Sum value',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.sumValue.description}',
        text: 'The total amount of money reported for conversions from clicks.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.viewSumValue}',
        text: 'View sum value',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.viewSumValue.description}',
        text: 'The total amount of money reported for view-through conversions.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.totalAverageValue}',
        text: 'Total average value',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.totalAverageValue.description}',
        text: 'The average amount of money reported for all conversions(totalSumValue / totalConversions).',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.averageValue}',
        text: 'Average value',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.averageValue.description}',
        text: 'The average amount of money reported for conversions from clicks (sumValue / conversions).',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.viewAverageValue}',
        text: 'View average value',
        __typename: 'Translation',
      },
      {
        key: '{measurement:outbrain.viewAverageValue.description}',
        text: 'The average amount of money reported for view-through conversions (viewSumValue / viewConversions).',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.users}',
        text: 'Total users',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.users.description}',
        text: 'The number of distinct users who have logged at least one event, regardless of whether the site or app was in use when that event was logged.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.sessions}',
        text: 'Sessions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.sessions.description}',
        text: 'The number of sessions that began on your site or app (event triggered: session_start).',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.userEngagementDuration}',
        text: 'User engagement',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.userEngagementDuration.description}',
        text: "The total amount of time (in seconds) your website or app was in the foreground of users' devices.",
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.transactions}',
        text: 'Transactions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.transactions.description}',
        text: 'The count of transaction events with purchase revenue. Transaction events are in_app_purchase, ecommerce_purchase, purchase, app_store_subscription_renew, app_store_subscription_convert, and refund.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.totalRevenue}',
        text: 'Total revenue',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.totalRevenue.description}',
        text: 'The sum of revenue from purchases, subscriptions, and advertising (Purchase revenue plus Subscription revenue plus Ad revenue).',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.itemRevenue}',
        text: 'Item revenue',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.itemRevenue.description}',
        text: 'The total revenue from items only. Item revenue is the product of its price and quantity. Item revenue excludes tax and shipping values; tax & shipping values are specified at the event and not item level.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.eventCount}',
        text: 'Event count',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.eventCount.description}',
        text: 'The count of events.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.eventValue}',
        text: 'Event value',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.eventValue.description}',
        text: "The sum of the event parameter named 'value'.",
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.conversions}',
        text: 'Conversions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.conversions.description}',
        text: "The count of conversion events. Events are marked as conversions at collection time; changes to an event's conversion marking apply going forward. You can mark any event as a conversion in Google Analytics, and some events (i.e. first_open, purchase) are marked as conversions by default.",
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.bounceRate}',
        text: 'Bounce Rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.bounceRate.description}',
        text: 'The percentage of sessions that were not engaged ((Sessions Minus Engaged sessions) divided by Sessions). This metric is returned as a fraction; for example, 0.2761 means 27.61% of sessions were bounces.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.itemViewEvents}',
        text: 'Item View Events',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.itemViewEvents.description}',
        text: "The number of times the item details were viewed. The metric counts the occurrence of the 'view_item' event.",
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.addToCarts}',
        text: 'Add To Carts',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.addToCarts.description}',
        text: 'The number of times users added items to their shopping carts.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.checkouts}',
        text: 'Checkouts',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.checkouts.description}',
        text: "The number of times users started the checkout process. This metric counts the occurrence of the 'begin_checkout' event.",
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.engagementRate}',
        text: 'Engagement Rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.engagementRate.description}',
        text: 'The percentage of engaged sessions (Engaged sessions divided by Sessions). This metric is returned as a fraction; for example, 0.7239 means 72.39% of sessions were engaged sessions.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.screenPageViewsPerSession}',
        text: 'Engagement Rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.screenPageViewsPerSession.description}',
        text: 'The number of app screens or web pages your users viewed per session. Repeated views of a single page or screen are counted. (screen_view + page_view events) / sessions.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.averageSessionDuration}',
        text: 'Average Session Duration',
        __typename: 'Translation',
      },
      {
        key: '{measurement:ga4.averageSessionDuration.description}',
        text: "The average duration (in seconds) of users' sessions.",
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.subscribe_website}',
        text: 'Website subscriptions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.subscribe_website.description}',
        text: 'The number of subscribe events that occurred on your website and are attributed to your ads, based on information received from your Meta Pixel or Conversions API. \nIn some cases, this metric may be estimated.',
        __typename: 'Translation',
      },
      {
        key: '{provider.criteo}',
        text: 'Criteo',
        __typename: 'Translation',
      },
      {
        key: '{provider.criteo.description}',
        text: 'Criteo for advertisement',
        __typename: 'Translation',
      },
      {
        key: '{provider.googlesa360}',
        text: 'Google Search Ads 360',
        __typename: 'Translation',
      },
      {
        key: '{provider.googlesa360.description}',
        text: 'Get the most from your search campaign data. Search Ads 360 helps you respond to an ever-changing market in real time and at scale.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.cpc}',
        text: 'CPC',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.cpc.description}',
        text: 'Cost per click',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.cpm}',
        text: 'CPM',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.cpm.description}',
        text: 'Cost Per 1000 Impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.impressions}',
        text: 'Impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.impressions.description}',
        text: 'Number of impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.clicks}',
        text: 'Clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.clicks.description}',
        text: 'Number of clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.ctr}',
        text: 'CTR',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.ctr.description}',
        text: 'Click Through Rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.spend}',
        text: 'Spend',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.spend.description}',
        text: 'The total amount of money spent.',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.gross_impressions}',
        text: 'Gross impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.gross_impressions.description}',
        text: 'Gross impressions (Includes Invalid Impressions)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.cost_per_conversion}',
        text: 'CPA',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.cost_per_conversion.description}',
        text: 'Cost per conversion',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.conversion}',
        text: 'Conversions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.conversion.description}',
        text: 'Conversions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.conversion_rate}',
        text: 'Conversion rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.conversion_rate.description}',
        text: 'Conversion rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.result}',
        text: 'result',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.result.description}',
        text: 'result',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.result_rate}',
        text: 'Result rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.result_rate.description}',
        text: 'Result rate (%)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.cost_per_result}',
        text: 'Cost per result',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.cost_per_result.description}',
        text: 'Cost per result',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.engaged_view}',
        text: 'Engaged views',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.engaged_view.description}',
        text: '6-second views (Focused view)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.engaged_view_15s}',
        text: 'Engaged views 15s',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.engaged_view_15s.description}',
        text: '15-second views (Focused view)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.secondary_goal_result}',
        text: 'Secondary goal result',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.secondary_goal_result.description}',
        text: 'Secondary goal result',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.cost_per_secondary_goal_result}',
        text: 'Cost per secondary goal result',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.cost_per_secondary_goal_result.description}',
        text: 'Cost per secondary goal result',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.secondary_goal_result_rate}',
        text: 'Secondary goal result rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:tiktok.secondary_goal_result_rate.description}',
        text: 'Secondary goal result rate',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.Displays}',
        text: 'Impressions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.Displays.description}',
        text: 'The number of ad impressions served on publishers via Criteo',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.Clicks}',
        text: 'Clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.Clicks.description}',
        text: 'The number of clicks driven by your ads',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.ViewableDisplays}',
        text: 'Viewable Displays',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.ViewableDisplays.description}',
        text: 'The number of ads that have been viewed. A display is considered viewed if at least 50% of the ad appears on the screen for at least one second',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.Visits}',
        text: 'Visits',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.Visits.description}',
        text: 'The number of users on the target website or app for which at least one event occurred within the hour following a click',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.SalesAllClientAttribution}',
        text: 'Sales All Client Attribution',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.SalesAllClientAttribution.description}',
        text: 'The number of transactions or conversions resulting from Criteo ads, client attribution',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.SalesAllPc30d}',
        text: 'Sales All Pc 30d',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.SalesAllPc30d.description}',
        text: 'The number of transactions or conversions resulting from Criteo ads, post-click 30 days attribution',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.SalesAllPv24h}',
        text: 'Sales All Pv 24h',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.SalesAllPv24h.description}',
        text: 'The number of transactions or conversions resulting from Criteo ads, post-view 24 hours attribution',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.SalesAllPc30dPv24h}',
        text: 'Sales All Pc 30d Pv 24h',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.SalesAllPc30dPv24h.description}',
        text: 'The number of transactions or conversions resulting from Criteo ads, post-click 30 days and post-view 24 hours attribution',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.SalesAllPc1d}',
        text: 'Sales All Pc 1d',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.SalesAllPc1d.description}',
        text: 'The number of transactions or conversions resulting from Criteo ads, post-click 1 day attribution',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.SalesAllPc7d}',
        text: 'Sales All Pc 7d',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.SalesAllPc7d.description}',
        text: 'The number of transactions or conversions resulting from Criteo ads, post-click 7 days attribution',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.RevenueGeneratedAllClientAttribution}',
        text: 'Revenue Generated All, client attribution',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.RevenueGeneratedAllClientAttribution.description}',
        text: 'The amount of money generated by online sales, client attribution',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.RevenueGeneratedAllPc30d}',
        text: 'Revenue Generated All Pc 30d',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.RevenueGeneratedAllPc30d.description}',
        text: 'The amount of money generated by online sales, post-click 30 days attribution',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.RevenueGeneratedAllPv24h}',
        text: 'Revenue Generated All Pv 24h',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.RevenueGeneratedAllPv24h.description}',
        text: 'The amount of money generated by online sales, post-view 24 hours attribution',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.RevenueGeneratedAllPc30dPv24h}',
        text: 'Revenue Generated All Pc 30d Pv 24h',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.RevenueGeneratedAllPc30dPv24h.description}',
        text: 'The amount of money generated by online sales, post-click 30 days and post-view 24 hours attribution',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.RevenueGeneratedAllPc1d}',
        text: 'Revenue Generated All Pc 1d',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.RevenueGeneratedAllPc1d.description}',
        text: 'The amount of money generated by online sales, post-click 1 day attribution',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.RevenueGeneratedAllPc7d}',
        text: 'Revenue Generated All Pc 7d',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.RevenueGeneratedAllPc7d.description}',
        text: 'The amount of money generated by online sales, post-click 7 days attribution',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.RoasAllClientAttribution}',
        text: 'Roas All Client Attribution',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.RoasAllClientAttribution.description}',
        text: 'The ratio between revenue generated and the cost, client attribution',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.RoasAllPc30d}',
        text: 'Roas All Pc 30d',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.RoasAllPc30d.description}',
        text: 'The ratio between revenue generated and the cost, post-click 30 days attribution',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.RoasAllPv24h}',
        text: 'Roas All Pv 24h',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.RoasAllPv24h.description}',
        text: 'The ratio between revenue generated and the cost, post-view 24 hours attribution',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.RoasAllPc30dPv24h}',
        text: 'Roas All Pc 30d Pv 24h',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.RoasAllPc30dPv24h.description}',
        text: 'The ratio between revenue generated and the cost, post-click 30 days and post-view 24 hours attribution',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.RoasAllPc1d}',
        text: 'Roas All Pc 1d',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.RoasAllPc1d.description}',
        text: 'The ratio between revenue generated and the cost, post-click 1 day attribution',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.RoasAllPc7d}',
        text: 'Roas All Pc 7d',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.RoasAllPc7d.description}',
        text: 'The ratio between revenue generated and the cost, post-click 7 days attribution',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.AdvertiserAllValue}',
        text: 'Advertiser All Value',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.AdvertiserAllValue.description}',
        text: 'The revenue generated by each product, considering margin (if provided in your product catalog)',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.AppInstalls}',
        text: 'App Installs',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.AppInstalls.description}',
        text: 'The number of installations of your app',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.Reach}',
        text: 'Reach',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.Reach.description}',
        text: 'Share of potential users who have been served an ad',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.AdvertiserCost}',
        text: 'Advertiser Cost',
        __typename: 'Translation',
      },
      {
        key: '{measurement:criteo.AdvertiserCost.description}',
        text: 'Total money spent on Criteo advertising',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.outboundClicks}',
        text: 'Outbound clicks',
        __typename: 'Translation',
      },
      {
        key: '{measurement:facebook.outuboundClicks.description}',
        text: '',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.cost_per_conversion}',
        text: 'Cost per conversion',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.cost_per_conversion.description}',
        text: 'The cost of ad interactions divided by conversions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.cost_per_all_conversions}',
        text: 'Cost per all conversions',
        __typename: 'Translation',
      },
      {
        key: '{measurement:googleAds.metrics.cost_per_all_conversions.description}',
        text: 'The cost of ad interactions divided by all conversions',
      },
      {
        key: '{measurement:googleAds.metrics.average_cost}',
        text: 'Average cost',
      },
      {
        key: '{measurement:googleAds.metrics.average_cost.description}',
        text: 'The average amount you pay per interaction',
      },
      {
        key: '{measurement:googleAds.metrics.average_cpe}',
        text: 'Average CPE',
      },
      {
        key: '{measurement:googleAds.metrics.average_cpe.description}',
        text: "The average amount that you've been charged for an ad engagement",
      },
      {
        key: '{measurement:googleAds.metrics.average_cpv}',
        text: 'Average CPV',
      },
      {
        key: '{measurement:googleAds.metrics.average_cpv.description}',
        text: 'The average amount you pay each time someone views your ad',
      },
      {
        key: '{measurement:googleAds.metrics.interaction_rate}',
        text: 'Interaction rate',
      },
      {
        key: '{measurement:googleAds.metrics.interaction_rate.description}',
        text: 'How often people interact with your ad after it is shown to them',
      },
      {
        key: '{measurement:googleAds.metrics.engagement_rate}',
        text: 'Engagement rate',
      },
      {
        key: '{measurement:googleAds.metrics.engagement_rate.description}',
        text: "How often people engage with your ad after it's shown to them",
      },
      {
        key: '{measurement:googleAds.metrics.view_through_conversions}',
        text: 'View through conversions',
      },
      {
        key: '{measurement:googleAds.metrics.view_through_conversions.description}',
        text: 'The total number of view-through conversions',
      },
      {
        key: '{measurement:googleAds.metrics.all_conversions_from_interactions_rate}',
        text: 'All conversions from interactions rate',
      },
      {
        key: '{measurement:googleAds.metrics.all_conversions_from_interactions_rate.description}',
        text: 'All conversions from interactions (as oppose to view through conversions) divided by the number of ad interactions',
      },
      {
        key: '{measurement:googleAds.metrics.conversions_from_interactions_rate}',
        text: 'Conversions from interactions rate',
      },
      {
        key: '{measurement:googleAds.metrics.conversions_from_interactions_rate.description}',
        text: 'Conversions from interactions divided by the number of ad interactions',
      },
      {
        key: '{measurement:googleAds.metrics.video_view_rate}',
        text: 'Video view rate',
      },
      {
        key: '{measurement:googleAds.metrics.video_view_rate.description}',
        text: 'The number of views your TrueView video ad receives divided by its number of impressions',
      },
      {
        key: '{measurement:googleAds.metrics.cross_device_conversions}',
        text: 'Cross device conversions',
      },
      {
        key: '{measurement:googleAds.metrics.cross_device_conversions.description}',
        text: 'Conversions from when a customer clicks on a Google Ads ad on one device, then converts on a different device or browser',
      },
    ],
  },
};
export const teamQueryMock = {
  request: {
    query: TEAM_QUERY,
    variables: { team_id: 1037, withMembers: false, withOrg: false },
  },
  result: {
    data: {
      team: {
        team_id: 1037,
        name: 'MAGIX',
        logo: 'https://www.nexoya.com/wp-content/uploads/2022/06/nexoya_app_MAGIX.png',
        currency: 'EUR',
        number_format: 'de-DE',
        onboarding: null,
        featureFlags: [
          {
            name: 'budget_v1',
            status: true,
          },
          {
            name: 'campaignV1',
            status: false,
          },
          {
            name: 'detailed_report_v1',
            status: true,
          },
          {
            name: 'experimental_chatbot',
            status: false,
          },
          {
            name: 'performance_new_disabled',
            status: false,
          },
          {
            name: 'portfolio_dashboard_disabled',
            status: false,
          },
        ],
        dashboardUrls: [
          {
            name: 'Dashboard',
            url: 'https://metabase.nexoya.io/public/dashboard/df4c2dcc-288a-4b98-9b9e-e0cc31727cf2',
          },
        ],
        customization: null,
      },
      roles: [
        {
          name: '{role:member}',
          description: '{role:member.description}',
        },
        {
          name: '{role:support}',
          description: '{role:support.description}',
        },
        {
          name: '{role:readonly}',
          description: '{role:readonly.description}',
        },
        {
          name: '{role:fullaccess}',
          description: '{role:fullaccess.description}',
        },
      ],
    },
  },
};
