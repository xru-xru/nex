import React from 'react';

type Props = {
  name?: string;
  description?: string;
  emoji?: string;
  date?: Date;
};
type State = {
  name: string;
  description: string;
  emoji: string;
  date: Date;
};

function useEventMetaController({ name = '', description = '', emoji = '', date = new Date() }: Props = {}) {
  const initialState = React.useMemo(
    () => ({
      name,
      description,
      emoji,
      date,
    }),
    [name, description, emoji, date]
  );
  const [form, setForm] = React.useState<State>({
    name,
    description,
    emoji,
    date,
  });
  const handleFormChange = React.useCallback(
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

export default useEventMetaController;
