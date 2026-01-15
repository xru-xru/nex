import styled from 'styled-components';

interface AvatarBaseProps {
  readonly size: number;
}

export const AvatarBase = styled.div<AvatarBaseProps>`
  width: ${(props) => `${props.size}px`};
  height: ${(props) => `${props.size}px`};
  display: flex;
  position: relative;
  align-items: center;
  flex-shrink: 0;
  user-select: none;
  justify-content: center;

  .NEXYAvatarImg {
    width: 100%;
    /* height: 100%; */
    object-fit: cover;
    text-align: center;
  }
`;
export const Circle = styled(AvatarBase)`
  border-radius: 50%;
  overflow: hidden;
`;
