import React, { useEffect, useRef } from 'react';

import styled from 'styled-components';

import { useRandomEmoji } from '../../hooks/useRandomEmoji';
import { ParticleContainerStyled, particles } from '../../utils/particles';
import { useTenantName } from '../../hooks/useTenantName';

import Button from '../../components/Button';
import Dialog from '../../components/Dialog';
import Fade from '../../components/Fade';
import Typography from '../../components/Typography';

type Props = {
  isOpen: boolean;
  onClose: () => void;
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

function OnboardingSuccessDialog({ isOpen, onClose }: Props) {
  const emoji = useRandomEmoji();
  const elementRef = useRef(null);
  const tenantName = useTenantName();

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
          <SuccessDialogContent data-cy="portfolioSuccessContent" style={{ padding: '64px 32px 0' }}>
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
              withEllipsis={false}
              style={{
                marginBottom: 8,
              }}
            >
              Welcome to {tenantName}!
            </Typography>
            <Typography
              variant="subtitle"
              style={{
                textAlign: 'center',
              }}
              withEllipsis={false}
            >
              Super thrilled to have you on board!
            </Typography>
          </SuccessDialogContent>
        </Fade>

        <Fade in={isOpen} onExited={onClose} delay={500}>
          <SuccessDialogActions style={{ padding: '32px 76px' }}>
            <Button style={{ width: '100%' }} onClick={onClose} color="primary" variant="contained">
              Let's get started
            </Button>
          </SuccessDialogActions>
        </Fade>
      </ParticleContainerStyled>
    </Dialog>
  );
}

export default OnboardingSuccessDialog;
