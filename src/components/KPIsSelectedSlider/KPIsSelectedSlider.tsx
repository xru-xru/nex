import Slider from 'react-slick';

import styled from 'styled-components';

import { NexoyaMeasurement } from '../../types/types';
import '../../types/types';
import { RemoteKpiMutOptions, ThunkMutFn } from '../../types/types.custom';

import { buildKpiKey } from '../../utils/buildReactKeys';

import KPIChip from '../KPIChip';
import LoadingPlaceholder from '../LoadingPlaceholder';
import SliderArrow from '../SliderArrow';
import Text from '../Text';

type Props = {
  loading: boolean;
  selectedKpis: NexoyaMeasurement[];
  removeMutation: ThunkMutFn<RemoteKpiMutOptions>;
  disabled?: boolean;
};
const SliderStyled = styled(Slider)`
  margin: 0 -8px;

  .slick-list {
    padding-bottom: 15px;
  }
  .slick-slide > div {
    margin: 0 8px;
  }

  .slick-track {
    /* COMMENT: overwrite the width of the track so it doesn't center the slides when less than the minimum to show slider arrows */
    min-width: 100% !important;
  }

  [aria-label='next'] {
    right: -23px;
  }

  [aria-label='prev'] {
    left: -23px;
  }

  [aria-label='prev'],
  [aria-label='next'] {
    top: 5px;
  }
`;
// TODO: This is a copy from the portfolio KPI page as well.
const PlaceholderStyled = styled.div`
  display: flex;
  align-items: center;
  border: 1px dashed #ccc;
  width: 20%;
  padding: 12px;
  margin-bottom: 20px;
  margin-top: 5px;
  border-radius: 4px;
`;
const LoadingWrapStyled = styled.div`
  display: flex;
  margin: 0 -15px 25px -15px;

  & > div {
    min-height: 56px;
    margin: 0 15px;

    &:nth-child(1) {
      opacity: 1;
    }
    &:nth-child(2) {
      opacity: 0.8;
    }
    &:nth-child(3) {
      opacity: 0.6;
    }
    &:nth-child(4) {
      opacity: 0.4;
    }
  }
`;

const KPIsSelectedSlider = ({ selectedKpis, loading, removeMutation, disabled }: Props) => {
  if (loading) {
    return (
      <LoadingWrapStyled>
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
      </LoadingWrapStyled>
    );
  }

  return (
    <>
      {selectedKpis.length > 0 ? (
        <SliderStyled
          infinite={selectedKpis.length > 3 ? true : false}
          slidesToShow={4}
          prevArrow={<SliderArrow to="prev" />}
          nextArrow={<SliderArrow to="next" />}
          showSlider={selectedKpis.length > 3 ? true : false}
        >
          {selectedKpis.map((kpi) => (
            <KPIChip
              kpi={kpi}
              key={buildKpiKey(kpi, 'chip')}
              //@ts-expect-error
              onRemoveMutation={removeMutation}
              disabled={disabled}
            />
          ))}
        </SliderStyled>
      ) : (
        <PlaceholderStyled data-cy="noKpiSelected">
          <Text variant="caption">No KPIs selected yet</Text>
        </PlaceholderStyled>
      )}
    </>
  );
};

export default KPIsSelectedSlider;
