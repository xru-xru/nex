import { get } from 'lodash';
import styled from 'styled-components';

import { useTeamQuery } from '../../graphql/team/queryTeam';

import Avatar from '../../components/Avatar';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingPlaceholder from '../../components/LoadingPlaceholder';
import Text from '../../components/Text';
import { TeamIcon } from '../../components/icons';

const TitleWrapStyled = styled.div`
  display: flex;
  align-items: center;
  max-width: 650px;

  h2 {
    margin-right: 15px;
  }
`;
const WrapLoadingStyled = styled.div`
  flex: 1;
  margin-bottom: 25px;

  & > div:first-child {
    height: 70px;
    opacity: 0.75;
  }
`;

const TeamMeta = () => {
  const { data, loading, error } = useTeamQuery();
  const team = data?.team;

  return loading ? (
    <WrapLoadingStyled>
      <LoadingPlaceholder />
    </WrapLoadingStyled>
  ) : error ? (
    <ErrorMessage error={error} />
  ) : (
    <>
      <Avatar src={team?.logo} alt={team?.name} size="60px" fallback={TeamIcon} />
      <div>
        <TitleWrapStyled>
          <Text component="h2" display="inline-flex" capitalize>
            {team?.name}
          </Text>
        </TitleWrapStyled>

        <Text variant="caption">Organization:</Text>
        <Text capitalize>{get(team, 'organization.name', '')}</Text>
      </div>
    </>
  );
};

export default TeamMeta;
