import React from 'react';

import styled from 'styled-components';

import Typography from '../../components/Typography';

import Button from '../Button';
import { ApolloError } from '@apollo/client';
import SvgWarningTwo from '../icons/WarningTwo';
import { formatErrorMessageForUser } from '../../utils/errorFormatting';
import useUserStore from '../../store/user';

type Props = {
  error: ApolloError;
  handleClose: () => void;
  handleBack: () => void;
};
const ContentStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px 32px 32px;
  width: 455px;
`;
const ActionsStyled = styled.div`
  display: flex;
  justify-content: space-around;
  padding-bottom: 32px;
`;

function ErrorMessage({ handleClose, handleBack, error }: Props) {
  const { isSupportUser } = useUserStore();
  const formattedMessage = error ? formatErrorMessageForUser(error, isSupportUser) : '';

  return (
    <>
      <ContentStyled>
        <span
          role="img"
          aria-label="wearing-face emoji"
          style={{
            fontSize: 48,
          }}
        >
          😩
        </span>
        <Typography
          variant="h1"
          component="h2"
          style={{
            marginBottom: 8,
          }}
        >
          Oh snap!
        </Typography>
        <Typography
          variant="subtitle"
          style={{
            textAlign: 'center',
          }}
          withEllipsis={false}
        >
          Something went wrong.
        </Typography>
        {error && formattedMessage ? (
          <div className="break-word mt-2 max-h-56 overflow-scroll overflow-ellipsis whitespace-pre-line rounded border border-neutral-100 bg-neutral-50 p-2 text-red-400">
            <SvgWarningTwo warningCircleColor="#FCDFE6" warningColor="#E22252" style={{ height: 16, width: 16 }} />{' '}
            {formattedMessage}
          </div>
        ) : null}
      </ContentStyled>
      <ActionsStyled className="w-full gap-2 px-8">
        <Button className="w-full" onClick={handleBack} variant="contained" color="secondary">
          Go back
        </Button>
        <Button className="w-full" onClick={handleClose} variant="contained" color="tertiary">
          Close
        </Button>
      </ActionsStyled>
    </>
  );
}

export default ErrorMessage;
