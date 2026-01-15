import React, { useEffect, useRef } from 'react';

import { useRandomEmoji } from '../../../hooks/useRandomEmoji';
import { ParticleContainerStyled, particles } from '../../../utils/particles';
import { useTenantName } from '../../../hooks/useTenantName';

import Button from 'components/Button';
import Fade from 'components/Fade';

import * as Styles from '../styles/ProposalDialog';

interface Props {
  isOpen: boolean;
  toggleDialog: () => void;
  onClose: () => void;
}

function ProposalDialogSuccess({ isOpen, toggleDialog, onClose }: Props) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementRef.current, emoji, isOpen]);

  return (
    <Styles.DialogStyled
      isSuccess
      isOpen={isOpen}
      transition="pop"
      onClose={() => {
        toggleDialog();
        onClose();
      }}
    >
      <>
        <Styles.DialogContentStyled>
          <ParticleContainerStyled
            ref={elementRef}
            style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
          >
            <Fade in={isOpen} onExited={onClose} delay={350}>
              <span
                role="img"
                aria-label="success random emoji"
                style={{
                  fontSize: 48,
                }}
              >
                {emoji}
              </span>
            </Fade>
            <Fade in={isOpen} onExited={onClose} delay={500}>
              <Styles.SuccessNoteStyled>
                <h3>Sit back and relax, budget will be automatically shifted.</h3>
                <div>{tenantName} will now automatically change the budgets of all portfolios as proposed.</div>
                <Button onClick={toggleDialog} variant="contained" color="primary" autoFocus>
                  Ok, notify me when it's done
                </Button>
              </Styles.SuccessNoteStyled>
            </Fade>
          </ParticleContainerStyled>
        </Styles.DialogContentStyled>
      </>
    </Styles.DialogStyled>
  );
}

export default ProposalDialogSuccess;
