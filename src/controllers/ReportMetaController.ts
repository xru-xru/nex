import React from 'react';

type Props = {
  name?: string;
  description?: string;
};
type State = {
  name: string;
  description: string;
};

function useReportMetaController({ name = '', description = '' }: Props = {}) {
  const initialState = React.useMemo(
    () => ({
      name,
      description,
    }),
    [name, description]
  );
  const [form, setForm] = React.useState<State>({
    name,
    description,
  });
  const handleFormChange = React.useCallback(
    // TODO: finally figure out the flow types for this
    (ev: any) => {
      const { name, value } = ev.target;
      setForm((s) => ({ ...s, [name]: value }));
    },
    [setForm]
  );
  const resetForm = React.useCallback(() => setForm({ ...initialState }), [initialState, setForm]);
  return {
    form,
    handleFormChange,
    initialState,
    resetForm,
    setForm,
  };
}

export default useReportMetaController;
