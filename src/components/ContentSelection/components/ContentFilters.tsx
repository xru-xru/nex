import React from 'react';

import { useKpisFilter } from 'context/KpisFilterProvider';

import ContentFilterSource from 'components/ContentSelection/components/ContentFilterSource';
import ContentFilterType from 'components/ContentSelection/components/ContentFilterType';
import * as Styled from 'components/ContentSelection/styles/ContentFilters';
import SvgSlidersHRegular from 'components/icons/SlidersHRegular';

type Props = {
  preselect?: boolean;
};

function ContentFilters({ preselect }: Props) {
  const { active } = useKpisFilter();
  const [isPreselected, setIsPreselected] = React.useState<boolean>(false);
  const [isActiveChecked, setIsActiveChecked] = React.useState<boolean>(preselect || active.value);
  React.useEffect(() => {
    // prevent preselect value to reset it on each render
    if (!isPreselected) {
      setIsPreselected(true);
      active.set(preselect);
    }
  }, [active, preselect, isPreselected]);
  return (
    <Styled.WrapStyled>
      <Styled.LabelStyled>
        <SvgSlidersHRegular />
        <span>Filter by</span>
      </Styled.LabelStyled>
      <ContentFilterSource />
      <ContentFilterType />
      <Styled.CheckboxStyled
        checked={isActiveChecked}
        onClick={() => {
          setIsActiveChecked(!isActiveChecked);
          active.set(!isActiveChecked);
        }}
        label="Active"
      />
    </Styled.WrapStyled>
  );
}

export default ContentFilters;
