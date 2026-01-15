import styled from 'styled-components';

interface Props {
  invisible?: boolean;
}

export const BackdropLight = styled.div<Props>`
  background-color: ${({ invisible }) => (invisible ? 'transparent' : 'rgba(255,255,255,0.75)')};
`;
export const BackdropDark = styled.div<Props>`
  background-color: ${({ invisible }) => (invisible ? 'transparent' : 'rgba(50,50,50,0.65)')};
`;
