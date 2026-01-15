import React from 'react';
import { withRouter } from 'react-router-dom';

import styled from 'styled-components';

import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';

import SvgFlash from '../../components/icons/Flash';

import { colorByKey } from '../../theme/utils';

import '../../theme';
import Text from '../Text';
import dashboardTipsConfig from './dashboardTipsConfig';

const DashboardTipsWrapperStyled = styled.div`
  border-radius: 4px;
  background-color: ${colorByKey('greenTeal10')};
  padding: 24px 64px;
  min-height: 200px;
  overflow-x: hidden;
  overflow-y: scroll;
`;
const DashboardTipsContent = styled.div`
  display: flex;
  flex-direction: column;
  color: ${colorByKey('blueGrey')};

  span {
    font-weight: bold;
    color: ${colorByKey('greenTeal')};
    margin-top: 16px;
    cursor: pointer;
    border: none;
    background: none;
    outline: none;
  }
`;
const TipsIconStyled = styled.div`
  position: absolute;
  font-size: 32px;
  margin-left: -48px;
`;
const MAX_TIP_NUMBER = dashboardTipsConfig.length;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const DashboardTips = ({ history }) => {
  const [factNumber, setFactNumber] = React.useState<number>();
  // we "hack" setting fact number with useEffect, so the value is set only
  // when component is loaded for the first time, and not on every rerender
  React.useEffect(() => {
    setFactNumber(getRandomInt(MAX_TIP_NUMBER));
  }, []);
  if (typeof factNumber !== 'number') return null;

  function handleClick() {
    // since we have hardcoded config, it's ok
    // otherwise make it more dynamic
    if (factNumber === 2) {
      window.open(dashboardTipsConfig[factNumber].link, '_blank');
    } else {
      history.push(dashboardTipsConfig[factNumber].link);
    }
  }

  return (
    <DashboardTipsWrapperStyled data-cy="dashboardTipsSection">
      <TipsIconStyled>
        <SvgFlash />
      </TipsIconStyled>
      <Text
        component="h3"
        //@ts-ignore
        style={{
          fontSize: 18,
          fontWeight: 500,
          letterSpacing: 0.8,
          marginBottom: 18,
        }}
      >
        Quick tip:
      </Text>
      <DashboardTipsContent>
        {dashboardTipsConfig[factNumber].content}
        <span
          onClick={() => {
            track(EVENT.DASHBOARD_QUICK_TIP_LEARN_MORE);
            handleClick();
          }}
        >
          Learn more
        </span>
      </DashboardTipsContent>
    </DashboardTipsWrapperStyled>
  );
};

export default withRouter(DashboardTips);
