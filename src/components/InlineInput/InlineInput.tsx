import { useState } from 'react';

import styled from 'styled-components';

import { colorByKey } from '../../theme/utils';

import Typography from '../Typography';
import { PencilIcon } from '../icons';

type Props = {
  placeholder: string;
  value?: string;
  previewProps?: Record<string, any>;
  inputProps?: Record<string, any>;
  inputStyle?: Record<string, any>;
  previewStyle?: Record<string, any>;
};
const WrapStyled = styled.div`
  width: 100%;
`;
const PreviewWrapper = styled.div`
  display: flex;
  color: ${colorByKey('lightPeriwinkle')};
  padding: 12px;
  .previewEdit {
    display: inline-block;
    cursor: pointer;
    font-size: 12px;
    line-height: 1.5;
    margin-left: 12px;
    margin-top: 6px;
    visibility: hidden;
    opacity: 0;
    transition: all 0.5s ease;
  }
  &:hover {
    .previewEdit {
      visibility: visible;
      opacity: 1;
      transition: all 0.5s ease;
    }
  }
`;
const InputStyled = styled.input`
  background: transparent;
  border: none;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: ${colorByKey('darkGrey')};
  caret-color: ${colorByKey('greenTeal')};
  font-family: inherit;
  display: inline-block;
  padding: 12px;
  outline: none;

  &::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    color: #afafaf;
  }
  &::-moz-placeholder {
    /* Firefox 19+ */
    color: #afafaf;
  }
  &:-ms-input-placeholder {
    /* IE 10+ */
    color: #afafaf;
  }
  &:-moz-placeholder {
    /* Firefox 18- */
    color: #afafaf;
  }
`;

function InlineInput({ value, placeholder, inputProps, inputStyle, previewProps, previewStyle }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  function handleKeyDown(event) {
    const { key } = event;
    const keys = ['Escape', 'Tab'];
    const enterKey = 'Enter';
    const allKeys = [...keys, enterKey];

    if (allKeys.indexOf(key) > -1) {
      setIsEditing(false);
    }
  }

  function handleBlur(ev) {
    if (!ev.currentTarget.contains(ev.relatedTarget)) {
      setIsEditing(false);
    }
  }

  return (
    <>
      <WrapStyled onBlur={handleBlur} onKeyDown={handleKeyDown}>
        {isEditing ? (
          //@ts-ignore
          <InputStyled autoFocus {...inputProps} style={{ ...inputStyle }} />
        ) : (
          <PreviewWrapper
            onClick={() => setIsEditing(true)}
            //@ts-ignore
            style={{ ...previewStyle }}
          >
            <Typography
              {...previewProps}
              style={{
                width: '100%',
              }}
            >
              {value || placeholder}
            </Typography>
            <span className="previewEdit" onClick={() => setIsEditing(true)}>
              <PencilIcon />
            </span>
          </PreviewWrapper>
        )}
      </WrapStyled>
    </>
  );
}

export default InlineInput;
