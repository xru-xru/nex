import React, { useState } from 'react';

import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import { useOnboardingContext } from '../../context/OnboardingProvider';
import { useInviteUserMutation } from '../../graphql/user/mutationInviteUser';
import { useUserQuery } from '../../graphql/user/queryUser';
import { useTenantName } from '../../hooks/useTenantName';

import Button from '../../components/Button';
import ErrorBoundary from '../../components/ErrorBoundary';
import ErrorMessage from '../../components/ErrorMessage';
import Fieldset from '../../components/Form/Fieldset';
import FormGroup from '../../components/Form/FormGroup';
import { Logo } from '../../components/Logo';
import OnboardingStepper from '../../components/OnboardingStepper';
import TextField from '../../components/TextField';
import { Subtitle } from '../../components/Typography/styles';

import { ShareInvitePayload } from '../settings/InviteUserDialog';
import {
  FormGroupStyled,
  FormWrapperStyled,
  InputWrapper,
  LogoWrapper,
  OnboardingContentWrapper,
  OnboardingContentWrapperContainer,
  OnboardingForm,
  OnboardingFormWrapper,
  Title,
} from './styles';

function OnboardingInviteOthers() {
  const userQuery = useUserQuery();
  const tenantName = useTenantName();
  const [invitees, setInvitees] = useState<Array<{ id: string; email: string; name: string }>>([
    { id: uuidv4(), email: '', name: '' },
    { id: uuidv4(), email: '', name: '' },
    { id: uuidv4(), email: '', name: '' },
  ]);

  const updateInvitee = (id: string, email: string, name: string) => {
    setInvitees(invitees.map((invitee) => (invitee.id === id ? { id, email, name } : invitee)));
  };

  const [, { error }, extendInviteUser] = useInviteUserMutation();

  const { handleNextStep } = useOnboardingContext();

  async function handleSubmitInvite(payload: ShareInvitePayload) {
    try {
      await extendInviteUser({ ...payload });
    } catch (err) {
      console.log(err);
    }
  }

  const addInviteesAndNextStep = () => {
    const promises = invitees
      .filter(({ email, name }) => email && name)
      .map(({ email, name }) => handleSubmitInvite({ to_email: email, to_name: name }));
    Promise.all(promises)
      .then(() => toast.success('The users were invited to the team'))
      .finally(() => handleNextStep());
  };

  const renderPlaceholderBasedOnIdx = (idx: number, field: 'email' | 'name') => {
    switch (field) {
      case 'email':
        switch (idx) {
          case 0:
            return 'john@example.com';
          case 1:
            return 'emily@example.com';
          default:
            return 'Enter another email...';
        }
      case 'name':
        switch (idx) {
          case 0:
            return 'John Doe';
          case 1:
            return 'Emily Smith';
          default:
            return 'Enter another name...';
        }
      default:
        return '';
    }
  };

  const isEmailValid = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const hasDuplicates = (array: Array<string>) => {
    const lowerCaseArray = array.map((email) => email?.toLowerCase());
    return new Set(lowerCaseArray).size !== lowerCaseArray.length;
  };

  const areAllFieldsEmpty = invitees.every((invitee) => invitee.email.length === 0 && invitee.name.length === 0);

  const emails = invitees.map((invitee) => invitee.email).filter((email) => email.length > 0);

  const areAllFilledInviteesValid =
    invitees.every(
      (invitee) => invitee.email.length === 0 || (invitee.name.length > 0 && isEmailValid(invitee.email)),
    ) && !hasDuplicates(emails);

  return (
    <>
      <OnboardingFormWrapper>
        <OnboardingForm>
          <LogoWrapper>
            <Logo animationDisabled={true} />
          </LogoWrapper>
          <OnboardingContentWrapperContainer>
            <OnboardingContentWrapper>
              <div style={{ width: '100%' }}>
                <OnboardingStepper />
                <Title>{tenantName} is better with a team</Title>
                <Subtitle style={{ marginBottom: 40, maxWidth: 450 }}>
                  You can invite any member of your team that wants to have access sooner or if they want to integrate a
                  certain tool.
                </Subtitle>
                <ErrorBoundary>
                  <FormWrapperStyled>
                    <Fieldset>
                      {invitees.map(({ id, email, name }, idx) => (
                        <InputWrapper key={id}>
                          <FormGroupStyled style={{ flex: 0.6 }}>
                            <TextField
                              error={true}
                              fullWidth
                              autoComplete="off"
                              type="email"
                              id={`email-${id}`}
                              name="email"
                              placeholder={renderPlaceholderBasedOnIdx(idx, 'email')}
                              value={email}
                              style={{ fontWeight: 400 }}
                              onChange={(ev) => updateInvitee(id, ev?.target?.value, name)}
                            />
                          </FormGroupStyled>
                          <FormGroupStyled style={{ flex: 0.4 }}>
                            <TextField
                              fullWidth
                              autoComplete="off"
                              id={`name-${id}`}
                              name="name"
                              placeholder={renderPlaceholderBasedOnIdx(idx, 'name')}
                              style={{ fontWeight: 400 }}
                              value={name}
                              onChange={(ev) => updateInvitee(id, email, ev?.target?.value)}
                            />
                          </FormGroupStyled>
                        </InputWrapper>
                      ))}
                      <FormGroup>
                        <Button
                          disabled={areAllFieldsEmpty || !areAllFilledInviteesValid}
                          style={{ width: '100%', marginTop: 17 }}
                          onClick={addInviteesAndNextStep}
                          color="primary"
                          variant="contained"
                        >
                          Invite and continue
                        </Button>
                        <Button
                          style={{ width: '100%', marginTop: 30 }}
                          onClick={handleNextStep}
                          color="tertiary"
                          variant="text"
                        >
                          I'll do this later
                        </Button>
                      </FormGroup>
                    </Fieldset>
                  </FormWrapperStyled>
                </ErrorBoundary>
              </div>
            </OnboardingContentWrapper>
          </OnboardingContentWrapperContainer>
        </OnboardingForm>
      </OnboardingFormWrapper>
      {error || userQuery.error ? <ErrorMessage error={error || userQuery.error} /> : null}
    </>
  );
}

export default OnboardingInviteOthers;
