import { get } from 'lodash';
import styled from 'styled-components';

import { NexoyaFilterListType } from '../../types/types';

import { equalFilter } from '../../utils/integration';

import Checkbox from '../Form/Checkbox';
import Text from '../Text';

type Props = {
  list: NexoyaFilterListType[];
  name: string;
  addItems: (key: string, adding: NexoyaFilterListType[] | NexoyaFilterListType) => void;
  removeItems: (key: string, removing: NexoyaFilterListType[] | NexoyaFilterListType) => void;
  selected: NexoyaFilterListType[];
  disabled?: boolean;
};
const ContentStyled = styled.div`
  width: 100%;
  overflow: hidden;
  margin-bottom: 50px;

  & > div {
    overflow-y: auto;
    max-height: 260px;
    padding: 10px 0;
  }
`;
const CardStyled = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 10px 0;

  & > div:first-child {
    margin-right: 15px;
  }

  &:hover {
    [type='checkbox']:checked + label:before,
    [type='checkbox']:not(:checked) + label:before {
      border-color: #10b0f0;
    }
  }
`;

function ProviderFilterCards({ name, list, addItems, removeItems, selected, disabled = false }: Props) {
  return (
    <ContentStyled>
      <div>
        {list.map((filter) => {
          const [firstName, secondName, hintName] = get(filter, 'itemInfo', []);
          const isSelected = selected.some((sf) => equalFilter(sf, filter));
          return (
            <CardStyled
              key={filter.id}
              onClick={() => {
                if (isSelected) {
                  removeItems(name, filter);
                } else {
                  if (disabled) return;
                  else addItems(name, filter);
                }
              }}
            >
              <Checkbox
                name="check"
                isChecked={isSelected}
                onSelect={() => {}}
                onDeselect={() => {}}
                disabled={disabled}
              />
              {firstName ? (
                <Text
                  component="span"
                  style={{
                    fontSize: 16,
                    maxWidth: '55%',
                  }}
                  title={firstName}
                >
                  {firstName}
                </Text>
              ) : null}
              {secondName ? (
                <>
                  <span
                    style={{
                      marginRight: 5,
                      display: 'inline-block',
                    }}
                  >
                    :
                  </span>
                  <Text
                    component="span"
                    style={{
                      fontSize: 16,
                    }}
                    title={secondName}
                  >
                    {secondName}
                  </Text>
                </>
              ) : null}
              {hintName ? (
                <Text
                  component="span"
                  style={{
                    opacity: 0.75,
                    marginLeft: 10,
                  }}
                >
                  ({hintName})
                </Text>
              ) : null}
            </CardStyled>
          );
        })}
      </div>
    </ContentStyled>
  );
}

export default ProviderFilterCards;
