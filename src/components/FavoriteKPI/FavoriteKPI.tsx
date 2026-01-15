import styled from 'styled-components';

import { NexoyaMeasurement } from '../../types/types';

import { useAddDashboardKpi } from '../../graphql/kpi/mutationAddDashboardKpi';
import { useRemoveDashboardKpi } from '../../graphql/kpi/mutationRemoveDashboardKpi';

import Tooltip from '../Tooltip';
import StarIcon from '../icons/StarSolid';

type Props = {
  kpi: NexoyaMeasurement;
  showMode: boolean;
  refetch?: () => void;
};
const WrapperStyled = styled.div<{
  readonly isFavorite: boolean;
}>`
  position: relative;
  margin: 8px;
  color: ${({ isFavorite }) => (isFavorite ? '#f9db2f' : '#757575')};
  svg {
    cursor: pointer;
  }
`;

const FavoriteKPI = ({ kpi, showMode, refetch }: Props) => {
  const { isFavorite } = kpi;
  const [, , addDashboardKpiRemote] = useAddDashboardKpi();
  const [, , removeDashboardKpiRemote] = useRemoveDashboardKpi();
  //@ts-ignore
  const addMutation = addDashboardKpiRemote(kpi);
  //@ts-ignore
  const removeMutation = removeDashboardKpiRemote(kpi);

  async function handleClick() {
    // if isFavorite, remove from favoriteKpis
    if (isFavorite) {
      await removeMutation();
      refetch();
    } // else add to favoriteKpis
    else {
      await addMutation();
      refetch();
    }
  }

  const tooltipContent = isFavorite ? 'This metric is marked as favorite' : 'Mark this metric as your favorite';

  // Show mode is just for showing the icon on kpis list
  // (but only for favorite kpis, we don't need click handler there)
  // Decided to re-use same code because of code duplication,
  if (showMode) {
    return isFavorite ? (
      <Tooltip content={tooltipContent} variant="dark" data-cy="favoriteKPIDiv">
        <WrapperStyled isFavorite={isFavorite}>
          <StarIcon />
        </WrapperStyled>
      </Tooltip>
    ) : null;
  }

  return (
    <Tooltip content={tooltipContent} variant="dark" data-cy="favoriteKPIDiv">
      <WrapperStyled isFavorite={isFavorite}>
        {/*@ts-ignore*/}
        <StarIcon onClick={handleClick} />
      </WrapperStyled>
    </Tooltip>
  );
};

export default FavoriteKPI;
