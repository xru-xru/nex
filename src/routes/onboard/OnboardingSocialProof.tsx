import styled from 'styled-components';

import { useTeamQuery } from '../../graphql/team/queryTeam';
import { useTenantName } from '../../hooks/useTenantName';

import Avatar from '../../components/Avatar';
import Spinner from '../../components/Spinner';
import Typography from '../../components/Typography';
import SvgGeneraliLogo from '../../components/icons/GeneraliLogo';
import SvgMagixLogo from '../../components/icons/MagixLogo';
import SvgSwisscomLogo from '../../components/icons/SwisscomLogo';
import SvgYuhLogo from '../../components/icons/YuhLogo';
import SvgZkbLogo from '../../components/icons/ZkbLogo';

import { nexyColors } from '../../theme';
import useOrganizationStore from '../../store/organization';

const SideContent = styled.div`
  height: 100%;
  width: 100%;
  background: #f7f7f8;
  flex: 0.5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  position: relative;
  border-left: 1px solid #eaeaea;
`;

const SocialProofLowerWrapper = styled.div`
  margin: 128px;
  z-index: 10;

  @media (min-width: 48em) {
    margin: 64px 16px;
  }
`;

const SocialProofReviewWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 64px;
  z-index: 10;
`;

const VideoStyled = styled.video`
  max-width: 650px;
  height: auto;
  box-shadow:
    0px 0px 0px 5px rgba(14, 199, 106, 0.25),
    0px 0px 0px 12px rgba(14, 199, 106, 0.15),
    0px 0px 0px 16px rgba(14, 199, 106, 0.1);
  border: none;
  border-radius: 4px;

  @media (max-width: 96em) {
    max-width: 350px;
  }

  @media (max-width: 64em) {
    max-width: 250px;
  }
`;

const ReviewText = styled(Typography)`
  font-size: 22px;
  white-space: break-spaces;
  text-align: center;
`;

const SignatureText = styled(Typography)`
  font-size: 16px;
  margin-top: 24px;
`;

const AvatarReview = styled(Avatar)`
  width: 100px;
  height: 100px;
  margin-bottom: 48px;
  box-shadow:
    rgba(50, 50, 93, 0.25) 0 50px 100px -20px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
`;

const SocialProofLogoWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  row-gap: 48px;
  justify-content: center;
  align-items: center;

  @media (min-width: 48em) {
    align-content: flex-end;
  }

  svg {
    width: 30%;
    height: 4em;
    fill: currentColor;
    color: #c8c8c8;
    filter: grayscale(100%);
    transition: all 0.2s ease-in-out;
    &:hover {
      transition: all 0.2s ease-in-out;
      color: initial;
      filter: grayscale(0%);
    }
  }
`;

// const GradientBackground = styled.div`
//   border-radius: 50%;
//   filter: blur(12.5rem);
//   height: 45vw;
//   width: 45vw;
//   position: absolute;
//   z-index: 0;
// `;
// const GradientBackgroundRight = styled(GradientBackground)`
//   top: -25vh;
//   right: -35vw;
//   background-color: #e1ffe6;
// `;
// const GradientBackgroundLeft = styled(GradientBackground)`
//   top: -15vh;
//   left: -36vw;
//   background-color: rgba(241, 237, 251, 0.65);
// `;
// const GradientBackgroundBottom = styled(GradientBackground)`
//   bottom: -35vh;
//   right: -25vw;
//   background-color: rgba(225, 255, 230, 0.38);
// `;

export const OnboardingSocialProof = () => {
  const { data, loading } = useTeamQuery({
    withMembers: true,
    withOrg: false,
  });
  const tenantName = useTenantName();
  const { isNexoya } = useOrganizationStore();

  const videoSrc = data?.team?.onboarding?.videoSrc;

  return (
    <SideContent>
      {!loading ? (
        isNexoya() ? (
          <>
            <SocialProofReviewWrapper>
              {!videoSrc ? (
                <>
                  <AvatarReview src="https://pbs.twimg.com/profile_images/1421717086951419908/f-ic9LWG_400x400.jpg" />
                  <ReviewText>
                    "Within the first six weeks, revenue on the relevant Bing campaigns{' '}
                    <span style={{ color: nexyColors.greenTeal }}>increased by 315%</span> while the Cost Income Ratio{' '}
                    <span style={{ color: nexyColors.greenTeal }}>improved by 154%</span>. Simultaneously, the revenue
                    from both Google and Bing campaigns{' '}
                    <span style={{ color: nexyColors.greenTeal }}>increased by 83%</span>."
                  </ReviewText>
                  <SignatureText>
                    <span style={{ fontWeight: 500 }}>Markus Wenta</span> — Director Customer Acquisition & Analytics,
                    Magix
                  </SignatureText>
                </>
              ) : (
                <VideoStyled title={`Welcome to ${tenantName} onboarding video`} controls>
                  <source src={videoSrc} />
                </VideoStyled>
              )}
            </SocialProofReviewWrapper>
            <SocialProofLowerWrapper>
              <Typography style={{ fontSize: 24, fontWeight: 600, textAlign: 'center', marginBottom: 48 }}>
                You're in good company.
              </Typography>
              <SocialProofLogoWrapper>
                <SvgSwisscomLogo />
                <SvgYuhLogo style={{ width: '15%' }} />
                <SvgMagixLogo />
                <SvgGeneraliLogo style={{ height: '5em' }} />
                <SvgZkbLogo />
              </SocialProofLogoWrapper>
            </SocialProofLowerWrapper>
          </>
        ) : null
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Spinner />
        </div>
      )}
    </SideContent>
  );
};
