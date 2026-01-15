import { Img } from 'react-progressive-loader';

import styled from 'styled-components';

import Text from '../Text';

type Props = {
  title?: string;
  imgSrc?: string;
  children?: React.ReactNode;
  thumbSrc?: string;
  aspectRatio?: number;
};
const WrapStyled = styled.div`
  h2 {
    width: 100%;
    text-align: center;
    margin-bottom: 25px;
  }

  p {
    text-align: center;
    padding: 35px 0 50px;
    font-size: 14px;
    opacity: 0.65;
    max-width: 480px;
    margin: 0 auto;
  }
`;

function TutorialBlock({ imgSrc, thumbSrc, aspectRatio = 0.5, children, title }: Props) {
  return (
    <WrapStyled>
      {title ? <Text component="h2">{title}</Text> : null}
      <Img
        placeholderSrc={thumbSrc}
        src={imgSrc}
        bgColor="rgba(50,50,50, 0.05)"
        aspectRatio={aspectRatio}
        className="loader"
      />
      {children}
    </WrapStyled>
  );
}

export default TutorialBlock;
