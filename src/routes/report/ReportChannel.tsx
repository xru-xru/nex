import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { get } from 'lodash';
import styled from 'styled-components';

import { NexoyaSumReport } from '../../types/types';

import useCollectionsController from '../../controllers/CollectionsController';

import { channelInputArr } from '../../utils/channel';
import { format } from '../../utils/dates';
import { getUIDateRange } from '../../utils/report';
import { userInitials, userName } from '../../utils/user';

import Avatar from '../../components/Avatar';
import AvatarUser from '../../components/AvatarUser';
import Button from '../../components/Button';
import ButtonAdornment from '../../components/ButtonAdornment';
import ButtonAsync from '../../components/ButtonAsync';
import ChannelCard from '../../components/ChannelCard';
import Divider from '../../components/Divider/Divider';
import { HeaderBrick, HeaderBrickWrap } from '../../components/HeaderBrick';
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderIcon,
  PageHeaderTitle,
} from '../../components/PageHeader';
import Share from '../../components/Share';
import SidePanel, { useSidePanelState } from '../../components/SidePanel';
import Typography from '../../components/Typography';
import ChannelIcon from '../../components/icons/Channel';
import SvgDuration from '../../components/icons/Duration';
import SvgPencil from '../../components/icons/Pencil';
import { useSaveMutation } from '../../routes/report/reportKpi/kpisPicker/useSaveMutation';
import SelectChannels from '../../routes/reports/createReportButton/SelectChannels';

import { colorByKey } from '../../theme/utils';

import { useKpiSelectionReducer } from './reportKpi/kpisPicker/useKpiSelectionReducer';
import EditReportDetails from './shared/EditReportDetails';
import ReportOptions from './shared/ReportOptions';
import { checkAndConvertDates } from './utils';

interface Props {
  report: NexoyaSumReport;
  refetch: (...args: any) => any;
}
const ButtonWrapperStyled = styled.div`
  background: ${colorByKey('ghostWhite')};
  padding: 20px 32px 20px 32px;
  margin-top: auto;
  display: flex;
  justify-content: space-between;
`;
const EditChannelsWrapped = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;
const WrappedChannelsStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;
const ReportShareStyled = styled.div`
  margin-right: 0;
  .NEXYButton {
    margin-right: 0;
  }
`;

function ReportChannel({ report, refetch }: Props) {
  const { isOpen, toggleSidePanel } = useSidePanelState();
  const [miniRoute, setMiniRoute] = React.useState('report');
  const UIDateRange = getUIDateRange(report.dateRange);
  const dateRange = checkAndConvertDates(report.dateRange);
  const contents = get(report, 'contents', []);

  function preselectedChannels() {
    const channelIds = [];
    report.kpis.map((kpi) => {
      const collectionId = kpi.collection ? kpi.collection.collection_id : 0;
      return !channelIds.includes(collectionId) && channelIds.push(collectionId);
    });
    return channelIds;
  }

  const { edges, error, channels, selectedChannels, addChannel, removeChannel } = useCollectionsController(
    preselectedChannels()
  );
  const { toAdd, toRemove, loading, addItem, removeChannelItem, setLoading } = useKpiSelectionReducer(
    channelInputArr(selectedChannels)
  );
  const handleUpdate = useSaveMutation({
    toAdd,
    toRemove,
    setLoading,
    reportId: report.report_id,
    onSuccess: refetch,
    onDone: onClose,
    channel: true,
  });

  function handleChannelAdd(id) {
    // create a dummy payload to conform to
    // buildKpiKey implementation
    const payload = {
      measurement_id: report.report_id,
      provider_id: id,
    };
    addChannel(id);
    addItem(payload);
  }

  function handleChannelRemove(id) {
    const payload = {
      measurement_id: report.report_id,
      provider_id: id,
    };
    removeChannel(id);
    removeChannelItem(payload);
  }

  function onClose() {
    toggleSidePanel();
  }

  async function handleSubmit() {
    try {
      const res = await handleUpdate();

      if (get(res, 'data.updateReport', null)) {
        refetch();
        onClose();
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  useHotkeys(`esc`, onClose);
  return (
    <div>
      <EditReportDetails
        isOpen={miniRoute === 'editReport'}
        onClose={() => setMiniRoute('report')}
        reportId={report.report_id}
        name={report.name}
        description={report.description || ''}
        refetch={refetch}
        dateRange={dateRange}
      />
      <PageHeader>
        <div>
          <PageHeaderTitle>
            <PageHeaderIcon>
              <Avatar size={32}>
                <ChannelIcon />
              </Avatar>
            </PageHeaderIcon>
            <Typography variant="h1" component="h2" data-cy="reportName">
              {report.name}
            </Typography>
          </PageHeaderTitle>

          <PageHeaderDescription addTitleIconSpace>
            <Typography variant="subtitle" withEllipsis={false} data-cy="reportDescription">
              {report.description || 'No report description'}
            </Typography>
          </PageHeaderDescription>
        </div>
        <PageHeaderActions>
          {/* <DownloadButton
           report={report}
           disabled={
             refetching || report.kpis.length === 0 || miniRoute === 'editKpis'
           }
          /> */}
          <ReportShareStyled>
            <Share type="report" itemId={report.report_id} />
          </ReportShareStyled>
          <ReportOptions
            reportName={report.name}
            reportId={report.report_id}
            onEdit={() => setMiniRoute('editReport')}
            shallowFunctions={true}
          />
        </PageHeaderActions>
      </PageHeader>
      <HeaderBrickWrap withTitleIconSpace>
        <HeaderBrick
          data-cy="reportDateRange"
          icon={
            <SvgDuration
              style={{
                fontSize: 32,
              }}
            />
          }
          label="Date range"
          content={`${format(UIDateRange.range.dateFrom, 'DD MMM YYYY')} - ${format(
            UIDateRange.range.dateTo,
            'DD MMM YYYY'
          )}`}
        />
        <HeaderBrick
          data-cy="reportUpdatedBy"
          icon={<AvatarUser email={report?.updatedBy?.email} fallback={userInitials(report?.updatedBy)} size={32} />}
          label="Updated by"
          content={userName(report.updatedBy, {
            abbreviate: true,
          })}
        />
      </HeaderBrickWrap>
      <Divider />
      <PageHeader>
        <EditChannelsWrapped>
          <Typography variant="h2" component="h2">
            Channel details
          </Typography>
          <Button
            id="addChannel"
            variant="contained"
            color="secondary"
            onClick={toggleSidePanel}
            startAdornment={
              <ButtonAdornment position="start">
                <SvgPencil />
              </ButtonAdornment>
            }
          >
            Edit channels
          </Button>
        </EditChannelsWrapped>
      </PageHeader>
      <WrappedChannelsStyled>
        {(contents || []).map((item, index) => (
          <ChannelCard key={`${item.provider.provider_id}--${index}`} item={item} />
        ))}
      </WrappedChannelsStyled>
      <SidePanel
        isOpen={isOpen}
        onClose={toggleSidePanel}
        paperProps={{
          style: {
            width: '840px',
          },
        }}
      >
        <SelectChannels
          style={{
            padding: '0 32px',
            overflow: 'hidden',
          }}
          edges={edges}
          loading={loading}
          error={error}
          selectedChannels={selectedChannels}
          channels={channels}
          addChannel={handleChannelAdd}
          removeChannel={handleChannelRemove}
        />
        <ButtonWrapperStyled>
          <Button id="cancel" variant="contained" onClick={onClose}>
            Cancel
          </Button>
          <ButtonAsync
            id="update"
            variant="contained"
            color="primary"
            loading={loading}
            disabled={!selectedChannels.length}
            onClick={handleSubmit}
          >
            Update
          </ButtonAsync>
        </ButtonWrapperStyled>
      </SidePanel>
    </div>
  );
}

export default ReportChannel;
