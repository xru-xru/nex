import React, { useCallback, useEffect, useState } from 'react';

import clsx from 'clsx';
import { debounce } from 'lodash';

import Input from '../Input';
import InputAdornment from '../InputAdornment';
import SvgSearch from '../icons/Search';

type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  color?: string;
};

export const classes = {
  root: 'NEXYSearchField',
};
const SearchField = React.forwardRef<Props, any>(function SearchField(props, ref) {
  const { value, onChange, className, color, ...rest } = props;
  const [search, setSearch] = useState(value || '');

  const debouncedOnChange = useCallback(
    debounce((value) => {
      onChange(value);
    }, 750),
    [onChange],
  );

  useEffect(() => {
    setSearch(value);
  }, [value]);

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    setSearch(value);
    debouncedOnChange(value);
  };

  return (
    <Input
      type="search"
      color={color}
      value={search}
      onChange={handleChange}
      startAdornment={
        <InputAdornment position="start">
          <SvgSearch />
        </InputAdornment>
      }
      ref={ref}
      className={clsx(className, classes.root)}
      {...rest}
    />
  );
});

export default SearchField;
