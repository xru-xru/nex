import styled from 'styled-components';

import { DatePickerDateRange, NexoyaCustomKpiConfigType } from 'types';

import { withDateProvider } from 'context/DateProvider';

import BackButton from '../../components/Sidebar/components/BackButton';
import AvatarProvider from 'components/AvatarProvider';
import { DateSelector } from 'components/DateSelector';
import { PageHeader, PageHeaderActions, PageHeaderIcon, PageHeaderTitle } from 'components/PageHeader';
import { AdminLinkIcon } from 'components/icons';
import Typography from '../../components/Typography';
import SvgKpi from '../../components/icons/Kpi';
import { nexyColors } from '../../theme';
import React from 'react';
import { renderTagBasedOnConfigType } from '../kpi0/KpiHeader';

type Props = {
  from: Date;
  to: Date;
  providerId: number;
  title: string;
  adminUrl: string;
  condensed: boolean;
  handleDateChange: (event: DatePickerDateRange) => void;
  isSystemGeneratedCustomKpi?: boolean;
};

const PageHeaderStyled = styled(PageHeader)<{
  condensed: boolean;
}>`
  margin-bottom: ${({ condensed }) => (condensed ? 0 : '16px')};
`;

const IconLinkStyled = styled.a`
  padding: 8px;
  color: #797b7c;
  transition: color 0.175s;
  font-size: 18px;

  &:hover {
    color: ${({ theme }: any) => theme.colors.primary};
  }
`;

function ContentPageHeader({
  from,
  to,
  providerId,
  title,
  condensed,
  adminUrl,
  handleDateChange,
  isSystemGeneratedCustomKpi,
}: Props) {
  return (
    <PageHeaderStyled condensed={condensed}>
      <div>
        <BackButton />
        {isSystemGeneratedCustomKpi ? (
          <div className="mb-3 w-fit">{renderTagBasedOnConfigType(NexoyaCustomKpiConfigType.Placeholder)}</div>
        ) : null}
        <PageHeaderTitle>
          <PageHeaderIcon>
            {isSystemGeneratedCustomKpi ? (
              <SvgKpi
                color={nexyColors.lilac}
                style={{
                  height: 32,
                  width: 32,
                  margin: 'auto',
                }}
              />
            ) : (
              <AvatarProvider providerId={providerId} size={32} />
            )}
          </PageHeaderIcon>
          <Typography variant="h1" component="h2" withTooltip style={{ whiteSpace: 'pre' }}>
            {title}
          </Typography>

          {adminUrl ? (
            <IconLinkStyled
              target="_blank"
              rel="noopener noreferrer"
              href={adminUrl}
              // @ts-expect-error
              alt={title}
              title="Administration website"
              data-cy="adminWebsiteLink"
            >
              <AdminLinkIcon />
            </IconLinkStyled>
          ) : null}
        </PageHeaderTitle>
      </div>
      <PageHeaderActions>
        <div data-cy="contentPageDatePicker">
          <DateSelector dateFrom={from} dateTo={to} onDateChange={handleDateChange} hideFutureQuickSelection />
        </div>
      </PageHeaderActions>
    </PageHeaderStyled>
  );
}

export default withDateProvider(ContentPageHeader);
