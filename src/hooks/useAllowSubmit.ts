import React from 'react';

type Options = {
  initialValues?: Record<string, any>;
  values?: Record<string, any>;
  requiredFields?: string[];
};

function missingRequiredField(fields: string[], values: Record<string, any>): boolean {
  return fields.filter((f) => !values[f]).length > 0;
} // TODO: this was really quickly implemented. Instead let's use something like "fast-equals"

export default function useAllowSubmit({ initialValues, values, requiredFields = [] }: Options = {}): {
  allowSubmit: boolean;
} {
  const [allowSubmit, setAllowSubmit] = React.useState(false);
  React.useEffect(() => {
    if (missingRequiredField(requiredFields, values)) {
      setAllowSubmit(false);
    } else if (!allowSubmit && JSON.stringify(values) !== JSON.stringify(initialValues)) {
      setAllowSubmit(true);
    } else if (allowSubmit && JSON.stringify(values) === JSON.stringify(initialValues)) {
      setAllowSubmit(false);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, initialValues]);
  return {
    allowSubmit,
  };
}
