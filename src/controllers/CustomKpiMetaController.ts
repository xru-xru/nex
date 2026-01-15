import React from 'react';

type State = {
  name?: string;
  description?: string;
  calcType?: string;
};
type Props = {
  name?: string;
  description?: string;
  calcType?: string;
};

function useCustomKpiMetaController({ name = '', description = '', calcType = 'max' }: Props = {}) {
  const initialState = React.useMemo(
    () => ({
      name,
      description,
      calcType,
    }),
    [name, description, calcType]
  );
  const [customKpiMeta, setCustomKpiMeta] = React.useState<State>({
    name,
    description,
    calcType,
  });
  const handleCustomKpiMetaInputChange = React.useCallback(
    (ev: any) => {
      const { name, value } = ev.target;
      setCustomKpiMeta((s: State): State => ({ ...s, [name]: value })); // dumb typing because of flow :(
    },
    [setCustomKpiMeta]
  );
  const resetCustomKpiMeta = React.useCallback(
    () => setCustomKpiMeta({ ...initialState }),
    [initialState, setCustomKpiMeta]
  );
  return {
    customKpiMeta,
    handleCustomKpiMetaInputChange,
    resetCustomKpiMeta,
  };
}

export default useCustomKpiMetaController;
