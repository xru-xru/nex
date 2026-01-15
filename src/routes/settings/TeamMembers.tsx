import React from 'react';

import { get } from 'lodash';

import { NexoyaRoleDef, NexoyaTeamMember, NexoyaUser } from 'types';

import { useTeamQuery } from 'graphql/team/queryTeam';
import { useUserQuery } from 'graphql/user/queryUser';
import { useTenantName } from 'hooks/useTenantName';

import { userInitials, userName } from 'utils/user';

import { ChangeRoleDialog } from './components/ChangeRoleDialog';
import { TeamMemberOptionsMenu } from './components/TeamMemberOptionsMenu';
import { TeamRoleSelector } from './components/TeamRoleSelector';
import AvatarUser from 'components/AvatarUser';
import ErrorMessage from 'components/ErrorMessage';
import GridHeader from 'components/GridHeader';
import LoadingPlaceholder from 'components/LoadingPlaceholder';
import Text from 'components/Text';

import * as Styles from './styles/TeamMembers';

import RemoveUserDialog from './RemoveUserDialog';

const TeamMembers = () => {
  // hooks
  const {
    data: teamQueryData,
    loading: teamQueryLoading,
    error: teamQueryError,
  } = useTeamQuery({
    withMembers: true,
  });
  const { data: userQueryData, loading: userQueryLoading, error: userQueryError } = useUserQuery({});
  const tenantName = useTenantName();

  // state
  const [removeUser, setRemoveUser] = React.useState<NexoyaTeamMember>();
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = React.useState<boolean>(false);
  const [pendingMemberRoleChange, setPendingMemberRoleChange] = React.useState<{
    member: NexoyaTeamMember;
    newRole: string;
  }>();
  const [isChangeRoleDialogOpen, setIsChangeRoleDialogOpen] = React.useState<boolean>(false);
  const members: Array<NexoyaTeamMember> = get(teamQueryData, 'team.members', []);
  const roles: NexoyaRoleDef[] = get(teamQueryData, 'roles', []);
  const loggedInUser: NexoyaUser = get(userQueryData, 'user', {});
  const canChangeOtherTeamMemberRoles = React.useMemo(() => {
    if (!loggedInUser) return false;

    // check if the role of the current logged in user is support
    return loggedInUser.activeRole?.name === '{role:support}';
  }, [loggedInUser]);

  const loading = teamQueryLoading || userQueryLoading;
  const error = teamQueryError || userQueryError;

  return loading ? (
    <Styles.WrapLoadingStyled>
      <LoadingPlaceholder />
      <LoadingPlaceholder />
      <LoadingPlaceholder />
    </Styles.WrapLoadingStyled>
  ) : error ? (
    <ErrorMessage error={error} />
  ) : (
    <>
      <Styles.WrapStyled>
        <GridHeader
          style={{
            'grid-template-columns': 'minmax(230px,1fr) minmax(180px,1fr)',
          }}
        >
          <Text>Member</Text>
          <Text>Email</Text>
        </GridHeader>
        {members.map((member) => (
          <Styles.CardStyled
            key={member.user_id}
            style={{
              'grid-template-columns': 'minmax(230px,1fr) minmax(180px,1fr)',
            }}
          >
            <Styles.GridStyled>
              <AvatarUser
                email={member.email}
                fallback={userInitials(member)}
                style={{
                  marginRight: 15,
                }}
              />
              <Text>{userName(member)}</Text>
            </Styles.GridStyled>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Styles.StyledEmail>{member.email}</Styles.StyledEmail>
              {member.email !== `support@${tenantName.toLowerCase()}.com` && (
                <div style={{ display: 'flex', marginLeft: 'auto' }}>
                  {canChangeOtherTeamMemberRoles && (
                    <TeamRoleSelector
                      allRoles={roles}
                      currentRoleName={member.role.name}
                      onChange={(newRoleDef) => {
                        setPendingMemberRoleChange({
                          member,
                          newRole: newRoleDef.name,
                        });
                        setIsChangeRoleDialogOpen(true);
                      }}
                    ></TeamRoleSelector>
                  )}
                  <TeamMemberOptionsMenu
                    member={member}
                    onDelete={(member) => {
                      setIsRemoveDialogOpen(true);
                      setRemoveUser(member);
                    }}
                  ></TeamMemberOptionsMenu>
                </div>
              )}
            </div>
          </Styles.CardStyled>
        ))}
      </Styles.WrapStyled>
      <RemoveUserDialog user={removeUser} isDialogOpen={isRemoveDialogOpen} closeDialog={setIsRemoveDialogOpen} />
      {pendingMemberRoleChange && (
        <ChangeRoleDialog
          member={pendingMemberRoleChange.member}
          newRole={pendingMemberRoleChange.newRole}
          isDialogOpen={isChangeRoleDialogOpen}
          closeDialog={setIsChangeRoleDialogOpen}
        ></ChangeRoleDialog>
      )}
    </>
  );
};

export default TeamMembers;
