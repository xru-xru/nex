import React, { useEffect, useRef } from 'react';

import styled from 'styled-components';

import { useRandomEmoji } from '../../../hooks/useRandomEmoji';
import { ParticleContainerStyled, particles } from '../../../utils/particles';
import { useTenantName } from '../../../hooks/useTenantName';

import Button from '../../../components/Button';
import Dialog from '../../../components/Dialog';
import Fade from '../../../components/Fade';
import Typography from '../../../components/Typography';

import { colorByKey } from '../../../theme/utils';

import { nexyColors } from '../../../theme';

type Props = {
  portfolio: any;
  isOpen: boolean;
  onClose: () => void;
  onStartNewProcess: () => void;
  onSuccess: () => void;
};
const SuccessDialogContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 76px 0 76px;
`;
const SuccessDialogActions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 76px;
  margin-top: 40px;
  margin-bottom: 20px;
`;
const NoteStyled = styled.div`
  padding: 0 76px 64px 76px;
  color: ${colorByKey('cloudyBlue')};
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.5px;
  line-height: 16px;
`;

function PortfolioSuccessDialog({ portfolio, isOpen, onClose, onStartNewProcess, onSuccess }: Props) {
  const emoji = useRandomEmoji();
  const tenantName = useTenantName();

  const elementRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const createParticlesAtCorner = particles({ particle: emoji, elementRef });

    createParticlesAtCorner('top-left');
    createParticlesAtCorner('top-right');
    createParticlesAtCorner('bottom-left');
    createParticlesAtCorner('bottom-right');
    createParticlesAtCorner('middle-top');
    createParticlesAtCorner('middle-bottom');
    createParticlesAtCorner('middle-left');
    createParticlesAtCorner('middle-right');
  }, [elementRef.current, emoji, isOpen]);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      data-cy="portfolioSuccessDialog"
      transition="pop"
      paperProps={{
        style: {
          width: 455,
        },
      }}
    >
      <ParticleContainerStyled ref={elementRef}>
        <Fade in={isOpen} onExited={onClose} delay={350}>
          <SuccessDialogContent data-cy="portfolioSuccessContent">
            <span
              role="img"
              aria-label="success random emoji"
              style={{
                fontSize: 48,
              }}
            >
              {emoji}
            </span>
            <Typography
              variant="h1"
              component="h2"
              style={{
                marginBottom: 8,
              }}
            >
              Whoop whoop!
            </Typography>
            <Typography
              variant="subtitle"
              style={{
                textAlign: 'center',
              }}
              withEllipsis={false}
            >
              You successfully created a portfolio by the name{' '}
              <strong
                style={{
                  color: nexyColors.greenTeal,
                }}
              >
                {portfolio?.title}
              </strong>
            </Typography>
          </SuccessDialogContent>
        </Fade>
        <Fade in={isOpen} onExited={onClose} delay={500}>
          <SuccessDialogActions>
            <Button onClick={onStartNewProcess} variant="contained" id="portfolioCreateAnother">
              Create another
            </Button>
            <Button onClick={onSuccess} color="primary" variant="contained" id="portfolioSeeItNow" autoFocus>
              See it now
            </Button>
          </SuccessDialogActions>
        </Fade>
        <Fade in={isOpen} onExited={onClose} delay={600}>
          <NoteStyled data-cy="dialogNote">
            <strong>Note:</strong> After verifying and testing your configuration, an optimization expert from{' '}
            {tenantName}
            will contact you.
          </NoteStyled>
        </Fade>
      </ParticleContainerStyled>
    </Dialog>
  );
}

export default PortfolioSuccessDialog;
