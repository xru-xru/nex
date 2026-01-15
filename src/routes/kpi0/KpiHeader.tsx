import { Link } from 'react-router-dom';

import { get } from 'lodash';
import styled from 'styled-components';

import { NexoyaCustomKpiConfigType, NexoyaMeasurement } from '../../types/types';
import '../../types/types';

import { useGlobalDate } from '../../context/DateProvider';

import AvatarProvider from '../../components/AvatarProvider';
import ContextEditMenu from '../../components/CustomKpi/ContextEditMenu';
import { DateSelector } from '../../components/DateSelector';
import FavoriteKPI from '../../components/FavoriteKPI';
import HelpCenter from '../../components/HelpCenter/HelpCenter';
import PageHeader from '../../components/PageHeader/PageHeader';
import PageHeaderActions from '../../components/PageHeader/PageHeaderActions';
import PageHeaderDescription from '../../components/PageHeader/PageHeaderDescription';
import PageHeaderIcon from '../../components/PageHeader/PageHeaderIcon';
import PageHeaderTitle from '../../components/PageHeader/PageHeaderTitle';
import BackButton from '../../components/Sidebar/components/BackButton';
import Typography from '../../components/Typography';
import TypographyTranslation from '../../components/TypographyTranslation';
import { AdminLinkIcon, ExternalLinkIcon } from '../../components/icons';
import { buildContentPath } from 'routes/paths';
import Target from '../../components/icons/Target';
import { SvgUtm } from '../../components/icons/Utm';
import { TagStyled } from '../portfolio/styles/OptimizationProposal';
import SvgKpi from '../../components/icons/Kpi';
import { nexyColors } from '../../theme';
import React from 'react';

const IconLinkStyled = styled.a`
  padding: 8px;
  color: #797b7c;
  transition: color 0.175s;
  font-size: 18px;

  &:hover {
    color: ${({ theme }: any) => theme.colors.primary};
  }
`;
type Props = {
  isCustomKpi?: boolean;
  customKpiConfigType?: NexoyaCustomKpiConfigType;
  measurement: NexoyaMeasurement;
  refetchKpi: () => void;
};

export const renderTagBasedOnConfigType = (configType: NexoyaCustomKpiConfigType) => {
  switch (configType) {
    case NexoyaCustomKpiConfigType.Utm:
      return <TagStyled bgColor="#E2DFF4">UTM tracking</TagStyled>;
    case NexoyaCustomKpiConfigType.Conversion:
      return <TagStyled bgColor="#05a8fa21">Conversion</TagStyled>;
    case NexoyaCustomKpiConfigType.Placeholder:
      return (
        <TagStyled bgColor={nexyColors.purpleish} className="whitespace-nowrap">
          System Generated Custom KPI
        </TagStyled>
      );
    case NexoyaCustomKpiConfigType.PreselectedContents:
      return (
        <TagStyled bgColor="#eaeaea" className="whitespace-nowrap">
          Preselected contents
        </TagStyled>
      );
    default:
      return null;
  }
};

const KpiHeader = ({ isCustomKpi, measurement: kpi, refetchKpi, customKpiConfigType }: Props) => {
  const { from, to, setDateRangeChange } = useGlobalDate();
  if (!kpi) {
    return null;
  }
  const collection = kpi.collection;
  const parentCollection = get(kpi, 'collection.parent_collection', null);
  const collectionTitle = get(kpi, 'collection.title', null);
  const collectionType = get(kpi, 'collection.collectionType.name', '');
  const isSystemGeneratedCustomKpi = kpi?.customKpiConfig?.configType === NexoyaCustomKpiConfigType.Placeholder;

  const renderIconBasedOnConfigType = (configType: NexoyaCustomKpiConfigType) => {
    switch (configType) {
      case NexoyaCustomKpiConfigType.Utm:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E2DFF4]">
            <SvgUtm />
          </div>
        );
      case NexoyaCustomKpiConfigType.Conversion:
        return <Target />;
      case NexoyaCustomKpiConfigType.PreselectedContents:
        return <AvatarProvider providerId={kpi.provider_id} size={32} />;
      case NexoyaCustomKpiConfigType.Placeholder:
        return (
          <SvgKpi
            color={nexyColors.lilac}
            style={{
              height: 32,
              width: 32,
              margin: 'auto',
            }}
          />
        );
      default:
        return <AvatarProvider providerId={kpi.provider_id} size={32} />;
    }
  };

  return (
    <PageHeader>
      <div>
        <BackButton />
        <PageHeaderTitle data-cy="kpiHeaderTitle">
          <PageHeaderIcon>{renderIconBasedOnConfigType(customKpiConfigType)}</PageHeaderIcon>
          {isSystemGeneratedCustomKpi ? (
            <Typography
              variant="h1"
              component="h2"
              style={{
                marginRight: 12,
              }}
            >
              {kpi.name}
            </Typography>
          ) : (
            <TypographyTranslation
              variant="h1"
              component="h2"
              text={kpi.name}
              style={{
                marginRight: 12,
              }}
            />
          )}
          {kpi.helpcenter_link && <HelpCenter url={kpi.helpcenter_link} />}
          <FavoriteKPI kpi={kpi} refetch={refetchKpi} showMode={false} />
          {collection.url ? (
            <IconLinkStyled
              target="_blank"
              rel="noopener noreferrer"
              href={collection.url}
              // @ts-expect-error
              alt={collection.title}
              title="Website link"
              data-cy="websiteLink"
            >
              <ExternalLinkIcon />
            </IconLinkStyled>
          ) : null}
          {collection.admin_url ? (
            <IconLinkStyled
              target="_blank"
              rel="noopener noreferrer"
              href={collection.admin_url}
              // @ts-expect-error
              alt={collection.title}
              title="Administration website"
              data-cy="adminWebsiteLink"
            >
              <AdminLinkIcon />
            </IconLinkStyled>
          ) : null}
        </PageHeaderTitle>
        <PageHeaderDescription addTitleIconSpace data-cy="kpiHeaderDescription">
          {parentCollection ? (
            <Link to={buildContentPath(parentCollection?.collection_id)}>
              <Typography variant="h2" withTooltip>
                {parentCollection.title}
              </Typography>
            </Link>
          ) : null}
          <Link to={buildContentPath(collection?.collection_id)} style={{ display: 'flex' }}>
            <Typography
              variant="h4"
              withEllipsis
              withTooltip
              style={{
                marginBottom: 12,
                marginRight: 5,
              }}
            >
              {collectionTitle}
            </Typography>
            {collectionType && <Typography variant="h4">{`(${collectionType})`}</Typography>}
          </Link>

          <div className="flex items-center gap-8">
            <TypographyTranslation withEllipsis={false} variant="subtitle" text={kpi.description} />
            <div className="w-fit justify-end">{renderTagBasedOnConfigType(customKpiConfigType)}</div>
          </div>
        </PageHeaderDescription>
      </div>
      <PageHeaderActions>
        <DateSelector
          dateFrom={from}
          dateTo={to}
          onDateChange={setDateRangeChange}
          hideFutureQuickSelection
          data-cy="kpiHeaderDateSelectorBtn"
        />
        {isCustomKpi && customKpiConfigType !== NexoyaCustomKpiConfigType.Utm && <ContextEditMenu kpi={kpi} />}
      </PageHeaderActions>
    </PageHeader>
  );
};

export default KpiHeader;
