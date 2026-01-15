import React from 'react';

import clsx from 'clsx';
import styled from 'styled-components';

import { classes } from './classes';

type Props = {
  // TODO: add proper type after notification backend done
  category: string;
  className?: string;
};
const WrapStyed = styled.span`
  display: inline-block;
  padding: 3px 7px;
  color: white;
  font-size: 10px;
  letter-spacing: 0.4px;
  line-height: 1;
  border-radius: 3px;
  color: #ccc;
  border: 1px solid #ccc;

  &.${classes.social} {
    /* background: red; */
    border: 1px solid #5fb760;
    color: #5fb760;
  }

  &.${classes.mailing} {
    /* background: red; */
  }

  &.${classes.video} {
    /* background: #377bb5; */
    border: 1px solid #377bb5;
    color: #377bb5;
  }

  &.${classes.search} {
    /* background: #60c0dc; */
    border: 1px solid #60c0dc;
    color: #60c0dc;
  }

  &.${classes.website} {
    /* background: #5fb760; */
    border: 1px solid #5fb760;
    color: #5fb760;
  }

  &.${classes.mobile} {
    /* background: red; */
  }

  &.${classes.ad} {
    /* background: red; */
  }
`;
const Category = React.forwardRef<Props, any>(function Category(props, ref) {
  const { category: propCategory, className, ...rest } = props;
  const category = propCategory?.toLowerCase();
  return (
    <WrapStyed
      className={clsx(className, classes.root, {
        [classes.social]: category === 'social',
        [classes.mailing]: category === 'mailing',
        [classes.video]: category === 'video',
        [classes.search]: category === 'search',
        [classes.website]: category === 'website',
        [classes.mobile]: category === 'mobile',
        [classes.ad]: category === 'ad',
      })}
      ref={ref}
      {...rest}
    >
      {category}
    </WrapStyed>
  );
});
export default Category;
