import styled from 'styled-components';

import { colorByKey } from '../../theme/utils';

const OutlinedBase = styled.div`
  padding: 12px 16px;
  border-radius: 4px;

  input,
  textarea {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.6px;

    &::-webkit-input-placeholder {
      font-weight: normal;
    }
    &::-moz-placeholder {
      font-weight: normal;
    }
    &:-ms-input-placeholder {
      font-weight: normal;
    }
    &::-ms-input-placeholder {
      font-weight: normal;
    }
  }
`;
export const LightOutlined = styled(OutlinedBase)`
  box-shadow: 0 0 0 1px ${colorByKey('paleLilac')};

  input,
  textarea {
    color: ${colorByKey('charcoalGrey')};

    &::-webkit-input-placeholder {
      color: ${colorByKey('cloudyBlue')};
    }
    &::-moz-placeholder {
      color: ${colorByKey('cloudyBlue')};
    }
    &:-ms-input-placeholder {
      color: ${colorByKey('cloudyBlue')};
    }
    &::-ms-input-placeholder {
      color: ${colorByKey('cloudyBlue')};
    }
  }

  &.focused {
    box-shadow: 0 0 0 2px ${colorByKey('greenTeal')};

    input,
    textarea {
      color: ${colorByKey('charcoalGrey')};
    }
  }
`;
export const DarkOutlined = styled(OutlinedBase)`
  box-shadow: 0 0 0 1px ${colorByKey('paleLilac33')};

  input,
  textarea {
    color: ${colorByKey('cloudyBlue')};

    &::-webkit-input-placeholder {
      color: ${colorByKey('cloudyBlue')};
    }
    &::-moz-placeholder {
      color: ${colorByKey('cloudyBlue')};
    }
    &:-ms-input-placeholder {
      color: ${colorByKey('cloudyBlue')};
    }
    &::-ms-input-placeholder {
      color: ${colorByKey('cloudyBlue')};
    }
  }

  &.focused {
    box-shadow: 0 0 0 2px ${colorByKey('greenTeal')};

    input,
    textarea {
      color: ${colorByKey('cloudyBlue')};
    }
  }
`;
