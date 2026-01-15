import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import styled from 'styled-components';

import Sidebar from './Sidebar';
import { mock_decorators } from '../../../.storybook/preview.jsx';

export default {
  title: 'Portfolio/Sidebar',
  component: Sidebar,
  decorators: mock_decorators(),
} as Meta;

const WrapStyled = styled.div`
  p {
    margin-top: 15px;
    margin-bottom: 15px;
  }

  button {
    margin-right: 15px;
  }
`;

export const Overview: StoryFn = () => (
  <WrapStyled>
    <Sidebar />
  </WrapStyled>
);

Overview.storyName = 'Overview';
