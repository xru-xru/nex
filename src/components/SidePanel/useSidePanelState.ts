// TODO: This is replica of useDialogState - code is identical, maybe abstract it and share between both
import React from 'react';

interface Props {
  initialState?: boolean;
}
export default function useSidePanelState({ initialState = false }: Props = {}) {
  const [isOpen, setIsOpen] = React.useState(initialState);
  const openSidePanel = React.useCallback(() => setIsOpen(true), [setIsOpen]);
  const closeSidePanel = React.useCallback(() => setIsOpen(false), [setIsOpen]);
  const toggleSidePanel = React.useCallback(() => setIsOpen((s) => !s), [setIsOpen]);
  return {
    isOpen,
    openSidePanel,
    closeSidePanel,
    toggleSidePanel,
  };
}
