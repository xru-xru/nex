import React from 'react';

import { get } from 'lodash';

import { useOnboardingContext } from '../../context/OnboardingProvider';
import { useSetUserInfoMutation } from '../../graphql/user/mutationSetUserInfo';
import { useUserQuery } from '../../graphql/user/queryUser';
import { useTenantName } from '../../hooks/useTenantName';

import { mergeQueryState } from '../../utils/graphql';

import Button from '../../components/Button';
import ErrorBoundary from '../../components/ErrorBoundary';
import ErrorMessage from '../../components/ErrorMessage';
import Fieldset from '../../components/Form/Fieldset';
import FormGroup from '../../components/Form/FormGroup';
import { Logo } from '../../components/Logo';
import OnboardingStepper from '../../components/OnboardingStepper';
import TextField from '../../components/TextField';
import { Subtitle } from '../../components/Typography/styles';

import {
  FormStyled,
  InputWrapper,
  LogoWrapper,
  OnboardingContentWrapper,
  OnboardingContentWrapperContainer,
  OnboardingForm,
  OnboardingFormWrapper,
  Title,
} from './styles';

function OnboardingName() {
  const userQuery = useUserQuery({ fetchPolicy: 'network-only' });
  const tenantName = useTenantName();

  const initFirstName = get(userQuery, 'data.user.firstname', '');
  const initLastName = get(userQuery, 'data.user.lastname', '');
  const [values, setValues] = React.useState({
    firstname: initFirstName || '',
    lastname: initLastName || '',
  });
  const [setUserInfo, userInfoState] = useSetUserInfoMutation({
    firstname: values.firstname,
    lastname: values.lastname,
  });

  const { loading, error } = mergeQueryState(userInfoState);
  const { handleNextStep } = useOnboardingContext();

  async function handleSubmit(ev: any) {
    ev.preventDefault();

    try {
      if (initFirstName !== values.firstname || initLastName !== values.lastname) {
        const resUser = await setUserInfo();

        if (!get(resUser, 'data.setUserInfo')) {
          return;
        }
      }
      handleNextStep();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  function handleChange(ev: any) {
    setValues({ ...values, [ev.target.name]: ev.target.value });
  }

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
                <Title>Let's get you started with {tenantName}!</Title>
                <Subtitle style={{ marginBottom: 40, maxWidth: 450 }}>
                  So pleased to have you on board! We're just taking some time to get to know you better, you'll access
                  the app in no time.
                </Subtitle>
                <ErrorBoundary>
                  <FormStyled onSubmit={handleSubmit}>
                    <Fieldset disabled={loading}>
                      <InputWrapper>
                        <FormGroup>
                          <TextField
                            fullWidth
                            value={values.firstname}
                            label="First Name"
                            id="firstname"
                            name="firstname"
                            helperText="Enter your first name"
                            style={{ fontWeight: 400 }}
                            onChange={(ev) => handleChange(ev)}
                          />
                        </FormGroup>
                        <FormGroup>
                          <TextField
                            fullWidth
                            value={values.lastname}
                            label="Last Name"
                            id="lastname"
                            name="lastname"
                            helperText="Enter your last name"
                            style={{ fontWeight: 400 }}
                            onChange={(ev) => handleChange(ev)}
                          />
                        </FormGroup>
                      </InputWrapper>
                      <Button
                        style={{ width: '100%' }}
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={!values.firstname || !values.lastname}
                      >
                        Continue
                      </Button>
                    </Fieldset>
                  </FormStyled>
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

export default OnboardingName;
