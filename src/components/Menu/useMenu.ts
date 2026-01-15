import React from 'react';

type Options = {
  initialOpen?: boolean;
};

function useMenu({ initialOpen = false }: Options = {}) {
  const anchorEl = React.useRef() as React.MutableRefObject<HTMLDivElement>;
  const [open, setOpen] = React.useState<boolean>(initialOpen);
  const toggleMenu = React.useCallback(() => {
    setOpen((state) => !state);
  }, [setOpen]);
  const closeMenu = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);
  const openMenu = React.useCallback(() => {
    setOpen(true);
  }, [setOpen]);
  const anchorStyles = {
    position: 'relative',
    zIndex: 10,
  };
  return {
    anchorEl,
    open,
    setMenu: setOpen,
    closeMenu,
    openMenu,
    toggleMenu,
    anchorStyles,
  };
}

export { useMenu };
