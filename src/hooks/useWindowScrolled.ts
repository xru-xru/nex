import React from 'react';

import useEventListener from '@use-it/event-listener';
import useDebounceCallback from 'use-debounce/lib/callback';

type Options = {
  debounce?: number;
  scrollY: number;
};

function useWindowScrolled({ debounce, scrollY }: Options) {
  const [scrolled, setScrolled] = React.useState(false);
  const [debounceScrollFn] = useDebounceCallback(() => {
    const isFurther = window.scrollY > scrollY;

    if (isFurther && !scrolled) {
      setScrolled(true);
    } else if (!isFurther && scrolled) {
      setScrolled(false);
    }
  }, debounce);

  // TODO: Rewrite this scroll debounce in to something batter
  function scrollFn() {
    const isFurther = window.scrollY > scrollY;

    if (isFurther && !scrolled) {
      setScrolled(true);
    } else if (!isFurther && scrolled) {
      setScrolled(false);
    }
  }

  useEventListener('scroll', debounce ? debounceScrollFn : scrollFn);
  return scrolled;
}

export { useWindowScrolled };
