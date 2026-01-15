import React from 'react';

import { capitalize, get } from 'lodash';
import styled from 'styled-components';

import { NexoyaTeamMember, NexoyaUser } from '../../types/types';
import '../../types/types';

import Text from '../../components/Text';

import { colorByKey } from '../../theme/utils';

type Props = {
  displayMembers: NexoyaUser[] | NexoyaTeamMember[];
  members: NexoyaUser[] | NexoyaTeamMember[];
};
type NameCountState = {
  string: string;
  count: number;
};
const WrapStyled = styled.div`
  color: ${colorByKey('blueGrey')};
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.6px;
  line-height: 1.24;
  width: calc(100% - 48px);
`;

function getNameString(user: NexoyaUser): string {
  const name = user.firstname ? `${capitalize(user.firstname.charAt(0))}. ` : '';
  const surname = capitalize(user.lastname || '');
  return `${name}${surname}`;
}

function getMemberNames(users: NexoyaUser[] | NexoyaTeamMember[]): string[] {
  // @ts-ignore
  return users.filter((u) => u.lastname !== 'nexoya' && !!u.lastname).map(getNameString);
}

function getNamesInfo(memberNames: string[], ctx: CanvasRenderingContext2D, boxWidth: number): NameCountState {
  ctx.font = '16px Helvetica';
  const namesString = {
    value: '',
    count: 0,
    width: 0,
  };
  let tryNextName = true;

  while (tryNextName) {
    const name = memberNames[namesString.count];
    const nameWidth = Math.floor(ctx.measureText(name).width);

    if (namesString.count < memberNames.length && namesString.width + nameWidth < boxWidth) {
      namesString.value = namesString.count === 0 ? `${name}` : `${namesString.value}, ${name}`;
      namesString.count += 1;
      namesString.width += nameWidth;
      continue;
    }

    tryNextName = false;
  }

  return {
    string: namesString.value,
    count: namesString.count,
  };
}

function MembersCount({ displayMembers, members }: Props) {
  const wrapRef = React.useRef(null);
  const canvasRef = React.useRef(document.createElement('canvas'));
  const [memberNames, setMemberNames] = React.useState(() => {
    return getMemberNames(members);
  });
  const [state, setState] = React.useState<NameCountState>({
    string: '',
    count: 0,
  });

  React.useLayoutEffect(() => {
    setMemberNames(getMemberNames(displayMembers));
  }, [members]);

  React.useLayoutEffect(() => {
    if (memberNames.length > 0) {
      const boxWidth = get(wrapRef, 'current.clientWidth', 0);
      const ctx = canvasRef.current.getContext('2d');
      setState(getNamesInfo(memberNames, ctx, boxWidth));
    }
  }, [memberNames]);
  return (
    <WrapStyled ref={wrapRef}>
      <Text>{state.string}</Text>
      {members.length > state.count ? <Text>+ {members.length - state.count} other members</Text> : null}
    </WrapStyled>
  );
}

export default MembersCount;
