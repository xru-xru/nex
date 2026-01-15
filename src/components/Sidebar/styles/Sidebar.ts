import styled, { css } from 'styled-components';

import { sizes } from '../../../theme/device';
import theme from 'theme/theme';
import { colorByKey } from 'theme/utils';
import { nexyColors } from '../../../theme';

interface WrapStyledSidebarProps {
  isCollapsed: boolean;
}
export const WrapStyled = styled.aside<{ sidebarWidth: string; isCollapsed: boolean }>`
  width: ${(props) => props.sidebarWidth};
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background: ${nexyColors.seasalt};
  display: flex;
  flex-direction: column;
  box-shadow: 1px 0px 0 0 rgba(223, 225, 237, 0.5);
  z-index: ${theme.layers.menu};

  transition: width 0.25s ease-in-out;

  .logo-wrap {
    margin-bottom: 32px;
    padding: 17px 12px 0;

    .NEXYLogo {
      width: 118px;
      ${(props) =>
        props.isCollapsed &&
        css`
          display: none;
        `}
    }
  }

  .team-wrap {
    margin-bottom: 32px;
    padding: 0 8px;

    .NEXYButtonBase {
      padding: 10px 14px;
    }
  }

  .nav-wrap {
    .NEXYButtonBase {
      padding: 10px 16px;
      ${(props) =>
        props.isCollapsed &&
        css`
          padding: 18px;
        `}

      svg {
        font-size: 19.2px;
      }

      ${(props) =>
        !props.isCollapsed &&
        css`
          svg {
            margin-right: 8px;
          }
        `}
    }
  }

  .support-wrap {
    margin-top: auto;
  }
`;
export const ScrollbarStyled = styled.div`
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
export const NavWrapStyled = styled.div`
  padding: 2px 12px;

  @media (max-width: ${sizes.laptop}px) {
    padding: 0;
  }

  .NEXYButtonBase {
    border-radius: 5px;
    padding: 6px 16px;
    color: #41424e;
    font-size: 14px;
    font-weight: normal;
    width: 100%;
    justify-content: start;

    &:hover {
      color: #41424e;
      background: #f4f4f6;
    }

    &.active {
      color: ${colorByKey('darkGrey')};
      background: #f2f2f4;

      svg {
        color: ${colorByKey('greenTeal')};
      }
    }

    @media (max-width: ${sizes.laptop}px) {
      justify-content: center !important;
    }
  }
`;
export const SupportWrapStyled = styled.div`
  padding: 0 12px;
  a {
    display: flex;
    justify-content: start;
    padding: 10px 16px;
    color: #41424e;
    width: 100%;
    font-weight: normal;
    font-size: 14px;
    background: transparent;

    &:hover {
      color: #41424e;
      background: #f4f4f6;

      svg {
        color: #41424e;
      }
    }

    svg {
      font-size: 20px;
    }
  }
`;

export const NewStyled = styled.div`
  background: ${colorByKey('greenTeal')};
  color: ${colorByKey('darkGrey')};
  text-transform: uppercase;
  font-size: 10px;
  padding: 2px 10px;
  border-radius: 10px;
  margin: -16px 0 0 7px;
  top: -3px;
`;
