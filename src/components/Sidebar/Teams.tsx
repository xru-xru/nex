import * as React from 'react';
import { useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../components-ui/Command';
import { Popover, PopoverContent, PopoverTrigger } from '../../components-ui/Popover';
import { NexoyaTeam } from '../../types/types';
import { useTeam } from '../../context/TeamProvider';
import { get } from 'lodash';
import styled from 'styled-components';
import Avatar from '../Avatar';
import ButtonBase from '../ButtonBase';
import { LaptopLUp } from '../MediaQuery';
import Text from '../Text';
import { withRouter } from 'react-router';
import { colorByKey } from '../../theme/utils';
import { RouterHistory } from 'react-router-dom';
import useUserStore from '../../store/user';

type Props = {
  history: RouterHistory;
};
const AnchorButtonStyled = styled(ButtonBase)`
  background: ${colorByKey('white')};
  border: 1px solid #e3e4e8;
  border-radius: 5px;
  width: 100%;
  justify-content: start;

  padding: 10px 14px;

  img {
    height: 100%;
  }
`;

const WrapNameStyled = styled.div`
  flex: 1;
  text-align: left;
  margin-left: 8px;
  min-width: 0;

  span {
    display: block;
    width: 100%;

    &:first-child::first-letter {
      text-transform: capitalize;
    }

    &:last-child {
      font-size: 12px;
      letter-spacing: 1px;
      font-weight: normal;
      color: ${colorByKey('blueyGrey')};
    }
  }
`;

function Teams({ history }: Props) {
  const { teamId, setTeam } = useTeam();
  const { user } = useUserStore();
  const teams: NexoyaTeam[] = user?.teams || [];
  const selectedTeam: NexoyaTeam = teams.find((t) => t.team_id === teamId);

  const [open, setOpen] = useState(false);

  if (!selectedTeam) {
    return null;
  }

  const handleSelect = (team: NexoyaTeam) => {
    if (team.team_id !== selectedTeam.team_id) {
      setTeam(team.team_id, () => {
        setOpen(false);
        history.push('/');
      });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="mx-2 mb-8 mt-0">
          <AnchorButtonStyled data-cy="teamNavBtn">
            <Avatar size={32} src={selectedTeam.logo} alt={selectedTeam.name}>
              {get(selectedTeam, 'name', '').charAt(0)}
            </Avatar>
            <LaptopLUp>
              <WrapNameStyled>
                <Text>{selectedTeam.name || ''}</Text>
                <Text>Team</Text>
              </WrapNameStyled>
            </LaptopLUp>
          </AnchorButtonStyled>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          {teams.length > 2 ? <CommandInput placeholder="Search teams..." /> : null}
          <CommandList>
            <CommandEmpty>No teams found.</CommandEmpty>
            <CommandGroup>
              {teams.map((team: NexoyaTeam) => (
                <CommandItem
                  keywords={[team.team_id?.toString()]}
                  key={team.team_id}
                  className="flex gap-2 capitalize"
                  value={String(team.name)}
                  onSelect={() => handleSelect(team)}
                >
                  <Avatar size={32} src={team.logo} alt={team.name}>
                    {get(team, 'name', '').charAt(0)}
                  </Avatar>
                  <WrapNameStyled>
                    <Text>{team.name}</Text>
                    <Text>Team</Text>
                  </WrapNameStyled>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default withRouter(Teams);
