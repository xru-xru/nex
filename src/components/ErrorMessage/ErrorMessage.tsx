import { Fragment, useEffect, useState } from 'react';

import { toast } from 'sonner';
import { getFormattedErrorMessage } from '../../utils/errorFormatting';

type Props = {
  error:
    | Error
    | {
        message: string;
      };
  className?: string;
};

const ErrorMessage = ({ error }: Props) => {
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line no-console
  console.log(error);
  useEffect(() => {
    setOpen(true);
  }, []);

  if (open) {
    const formattedMessage = getFormattedErrorMessage(error as Error);
    toast.error(formattedMessage);
  }

  return <Fragment />;
};

export default ErrorMessage;
