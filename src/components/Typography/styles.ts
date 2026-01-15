import styled, { css } from 'styled-components';

import { colorByKey } from '../../theme/utils';

export const TextBase = styled.p<{
  readonly withEllipsis?: boolean;
  readonly capitalize?: boolean;
}>`
  display: block;
  word-wrap: normal;
  font-weight: normal;
  line-height: 1.43;

  ${({ withEllipsis }) =>
    withEllipsis &&
    css`
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `};

  ${({ capitalize }) =>
    capitalize &&
    css`
      &:first-letter {
        text-transform: uppercase;
      }
    `};
`;
export const H1 = styled(TextBase)`
  font-size: 32px;
  letter-spacing: -0.4px;
  line-height: 1.31;
  color: ${colorByKey('black')};
`;
export const H2 = styled(TextBase)`
  font-size: 23px;
  letter-spacing: 0.4px;
  font-weight: 500;
  line-height: 1.39;
  color: ${colorByKey('darkGrey')};
`;
export const H3 = styled(TextBase)`
  font-size: 18px;
  letter-spacing: 0.6px;
  font-weight: 500;
  line-height: 1.33;
  color: ${colorByKey('black')};
`;
export const H4 = styled(TextBase)`
  font-size: 16px;
  letter-spacing: 0.6px;
  font-weight: 500;
  line-height: 1.5;
  color: ${colorByKey('darkGrey')};
`;
export const H5 = styled(TextBase)`
  font-size: 16px;
  letter-spacing: 0.5px;
  font-weight: 500;
  line-height: 1.5;
  color: ${colorByKey('cloudyBlue')};
`;
export const Paragraph = styled(TextBase)`
  font-size: 14px;
  letter-spacing: 0.6px;
  line-height: 1.43;
  color: ${colorByKey('darkGrey')};
`;
export const Subtitle = styled(TextBase)`
  font-size: 16px;
  letter-spacing: 0.6px;
  line-height: 1.5;
  color: ${colorByKey('blueGrey')};
`;
export const Subheadline = styled(TextBase)`
  font-size: 13px;
  letter-spacing: 0.6px;
  line-height: 1.5;
  font-weight: 500;
  color: ${colorByKey('cloudyBlue')};
`;
export const TitleCard = styled(TextBase)`
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: 0.6px;
  color: ${colorByKey('cloudyBlue')};
`;
export const TitleGroup = styled(TextBase)`
  font-size: 20px;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: normal;
  color: ${colorByKey('cloudyBlue')};
`;
export const SubtitlePill = styled(TextBase)`
  color: ${colorByKey('cloudyBlue')};
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.6px;
  line-height: 1.5;
`;
