import React from 'react';
import { RouterHistory, withRouter } from 'react-router-dom';

import { get } from 'lodash';
import styled from 'styled-components';

import { NexoyaShareType, NexoyaUser } from '../../types/types';
import { ShareItemTypes } from '../../types/types.custom';

import { useTeamQuery } from '../../graphql/team/queryTeam';
import { useInviteShareUserMutation } from '../../graphql/user/mutationInviteShareUser';

import { mergeQueryState } from '../../utils/graphql';
import { getShareUrl } from '../../utils/helpers';
import { emailRegExp, escapeRegExp } from '../../utils/regexp';
import { userInitials, userName } from '../../utils/user';

import { colorByKey } from '../../theme/utils';

import AvatarUser from '../AvatarUser';
import Button from '../Button';
import ButtonAsync from '../ButtonAsync';
import Dialog from '../Dialog';
import DialogContent from '../DialogContent';
import DialogTitle from '../DialogTitle';
import ErrorBoundary from '../ErrorBoundary';
import ErrorMessage from '../ErrorMessage';
import InputAdornment from '../InputAdornment';
import LoadingPlaceholder from '../LoadingPlaceholder/LoadingPlaceholder';
import NoSearchResults from '../NoSearchResults';
import TextField from '../TextField';
import Typography from '../Typography';
import SvgEnvelope from '../icons/Envelope';
import SvgSearch from '../icons/Search';
import ShareSuccessMessage from './ShareSuccessMessage';

export const LoadingWrapStyled = styled.div`
  & > div {
    height: 48px;
    margin-bottom: 5px;

    &:nth-child(2) {
      opacity: 0.75;
    }
    &:nth-child(3) {
      opacity: 0.5;
    }
    &:nth-child(4) {
      opacity: 0.25;
    }
  }
`;

export function searchMember(m: NexoyaUser, search: string): boolean {
  const regex = new RegExp(search, 'gi');
  return (m.firstname || '').search(regex) > -1 || (m.lastname || '').search(regex) > -1 || m.email.search(regex) > -1;
}

// TODO Needed?
type Props = {
  isOpen: boolean;
  toggleDialog: () => void;
  itemId: number;
  history: RouterHistory;
  type: ShareItemTypes;
};
type InvitePayload = {
  to_email: string;
  to_name: string;
  shareType: NexoyaShareType;
  url: string;
  sharingObjectName?: ShareItemTypes;
};

interface DialogStyledShareDialogProps {
  isSuccess: boolean;
}
const DialogStyled = styled(Dialog)<DialogStyledShareDialogProps>`
  .NEXYPaper {
    width: ${({ isSuccess }) => (isSuccess ? '450px' : '550px')};
    min-width: ${({ isSuccess }) => (isSuccess ? '450px' : '550px')};
    max-width: ${({ isSuccess }) => (isSuccess ? '450px' : '550px')};
    // height: ${({ isSuccess }) => (isSuccess ? '407px' : '667px')};
    min-height: ${({ isSuccess }) => (isSuccess ? '327px' : '667px')};
    max-height: ${({ isSuccess }) => (isSuccess ? '407px' : '667px')};
  }
  .NEXYFormControl {
    width: 100%;
  }
`;
const UserBlockStyled = styled.div`
  margin: 20px 0 40px 0;
  min-height: 278px;
  height: 278px;
  max-height: 278px;
  overflow-y: scroll;
`;
const UserRowStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  box-shadow: 0 1px 0 0 ${colorByKey('paleGrey')};

  .shareBtn {
    visibility: hidden;
    opacity: 0;
    height: 32px;
    padding: 12px 16px;
    // transition: visibility 0s linear 100ms, opacity 100ms;
  }

  &:hover {
    background-color: ${colorByKey('paleGrey25')};
    .shareBtn {
      visibility: visible;
      opacity: 1;
      // transition: visibility 0s linear 100ms, opacity 100ms;
    }
  }
`;
const UserInfoStyled = styled.div`
  display: flex;
  align-items: center;
  width: calc(100% - 122px);
`;
const EmailInviteWrapStyled = styled.div`
  margin: 40px 0 0 0;
  display: flex;
  flex-direction: column;
`;
const EmailInviteInputStyled = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 22px;
  .NEXYFormControl {
    margin-right: 16px;
  }
`;

function ShareDialog({ itemId, history, isOpen, toggleDialog, type }: Props) {
  const [search, setSearch] = React.useState('');
  const [shareEmail, setShareEmail] = React.useState('');
  const [skipInitial, setSkipInitial] = React.useState(true);
  const [isMemberShare, setIsMemberShare] = React.useState(false);
  const [isEmailShare, setIsEmailShare] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(true);
  const { data, loading, ...teamQuery } = useTeamQuery({
    withOrg: false,
    withMembers: true,
    skip: skipInitial,
  });
  const [, inviteShareUserState, extendInviteShareUser] = useInviteShareUserMutation();
  const { error } = mergeQueryState(teamQuery, inviteShareUserState);
  const teamMembers = get(data, 'team.members', []) || [];
  const filteredMembers = teamMembers.filter((m) => searchMember(m, escapeRegExp(search)));

  async function handleSubmitInvite(payload: InvitePayload, isEmail = false) {
    try {
      //@ts-ignore
      const res = await extendInviteShareUser({ ...payload });
      const inviteShareUser = get(res, 'data.inviteShareUser', false);

      if (inviteShareUser || inviteShareUser === 0) {
        setShowSuccess(true);

        if (isEmail) {
          setIsEmailShare(true);
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  React.useEffect(() => {
    if (isOpen) {
      setSearch('');
      setShareEmail('');
      setIsEmailShare(false);
      setIsMemberShare(false);
      setShowSuccess(false);
      setSkipInitial(false);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  return (
    <div>
      <DialogStyled isOpen={isOpen} onClose={toggleDialog} isSuccess={showSuccess}>
        {showSuccess ? (
          <ShareSuccessMessage
            isEmailShare={isEmailShare}
            history={history}
            email={shareEmail}
            handleClose={toggleDialog}
          />
        ) : (
          <>
            <DialogTitle>
              <Typography variant="h3" component="h3">
                Share {type}
              </Typography>
              <Typography variant="subtitle" component="p">
                Find the right person to check it out.
              </Typography>
            </DialogTitle>
            <DialogContent>
              <TextField
                name="email"
                type="search"
                placeholder="Search people"
                className="searchInput"
                value={search}
                onChange={(ev: any) => setSearch(ev.target.value)}
                autoComplete="off"
                inputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgSearch />
                    </InputAdornment>
                  ),
                }}
              />
              <ErrorBoundary>
                {loading ? (
                  <LoadingWrapStyled>
                    <LoadingPlaceholder />
                    <LoadingPlaceholder />
                    <LoadingPlaceholder />
                    <LoadingPlaceholder />
                  </LoadingWrapStyled>
                ) : (
                  <>
                    <UserBlockStyled>
                      {filteredMembers.length > 0 ? (
                        <>
                          {filteredMembers.map((user) => (
                            <UserRowStyled key={user.user_id}>
                              <UserInfoStyled>
                                <AvatarUser
                                  email={user.email}
                                  size={30}
                                  fallback={userInitials(user)}
                                  style={{
                                    marginRight: 12,
                                  }}
                                />
                                <Typography>{userName(user)}</Typography>
                              </UserInfoStyled>
                              <ButtonAsync
                                color="secondary"
                                variant="contained"
                                className="shareBtn"
                                loading={inviteShareUserState.loading}
                                onClick={() => {
                                  setIsMemberShare(true);
                                  setShareEmail(user.email);
                                  handleSubmitInvite({
                                    to_email: user.email,
                                    to_name: `${user.firstname} ${user.lastname}`,
                                    shareType: NexoyaShareType.Fullaccess,
                                    url: getShareUrl(itemId, type),
                                    sharingObjectName: type,
                                  });
                                }}
                              >
                                Share
                              </ButtonAsync>
                            </UserRowStyled>
                          ))}
                        </>
                      ) : (
                        <NoSearchResults />
                      )}
                    </UserBlockStyled>
                    <EmailInviteWrapStyled>
                      <Typography variant="h4" component="h4">
                        The right person is not here?
                      </Typography>
                      <Typography variant="subheadline" component="p" withEllipsis={false}>
                        No worries, just fill in their email and they will get read-only access to your team and a
                        direct link to this {type}.
                      </Typography>
                      <EmailInviteInputStyled>
                        <TextField
                          type="email"
                          value={!isMemberShare ? shareEmail : ''}
                          placeholder="Invite user by email..."
                          onChange={(ev) => setShareEmail(ev.target.value)}
                          onKeyPress={(ev) => {
                            //triggers submit by pressing the 'enter' key
                            if (ev.key === 'Enter' && emailRegExp.test(shareEmail)) {
                              return handleSubmitInvite(
                                {
                                  to_email: shareEmail,
                                  to_name: shareEmail,
                                  shareType: NexoyaShareType.Readonly,
                                  url: getShareUrl(itemId, type),
                                  sharingObjectName: type,
                                },
                                true,
                              );
                            }
                          }}
                          name="shareEmail"
                          inputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SvgEnvelope />
                              </InputAdornment>
                            ),
                          }}
                        />
                        {isMemberShare ? (
                          <Button color="primary" variant="contained" loading={false} disabled={true}>
                            Invite
                          </Button>
                        ) : (
                          <ButtonAsync
                            color="primary"
                            variant="contained"
                            loading={inviteShareUserState.loading}
                            disabled={!emailRegExp.test(shareEmail)}
                            onClick={() =>
                              handleSubmitInvite(
                                {
                                  to_email: shareEmail,
                                  to_name: shareEmail,
                                  shareType: NexoyaShareType.Readonly,
                                  url: getShareUrl(itemId, type),
                                  sharingObjectName: type,
                                },
                                true,
                              )
                            }
                          >
                            Invite
                          </ButtonAsync>
                        )}
                      </EmailInviteInputStyled>
                    </EmailInviteWrapStyled>
                  </>
                )}
              </ErrorBoundary>
            </DialogContent>
          </>
        )}
      </DialogStyled>
      {error ? <ErrorMessage error={error} /> : null}
    </div>
  );
}

export default withRouter(ShareDialog);
