import React from 'react';

type Props = {
  url: string;
  callbackFn: () => void;
  windowOptions?: Record<string, any>;
};
const defaultOptions = {
  toolbar: 'no',
  location: 'no',
  status: 'no',
  menubar: 'no',
  dependent: 'yes',
  scrollbars: 'yes',
  resizable: 'yes',
  width: 900,
  height: 800,
};

function useIntegrationPopup({ url, callbackFn, windowOptions = {} }: Props) {
  const popup = React.useRef(null);
  const interval = React.useRef(null);
  const [connecting, setConnecting] = React.useState(false);
  React.useEffect(() => {
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = null;
      }
    };
  }, []);

  function openConnectionWindow(ev: any) {
    ev.preventDefault();
    setConnecting(true);

    if (!popup.current) {
      const options = { ...defaultOptions, windowOptions };
      popup.current = window.open(
        url,
        'targetWindow', // We need a string of type "toolbar=no,location=no,..."
        Object.keys(options)
          .map((key) => `${key}=${options[key]}`)
          .join(',')
      );
      interval.current = setInterval(() => {
        if (popup.current && popup.current.closed) {
          clearInterval(interval.current);
          interval.current = null;
          popup.current = null;
          setConnecting(false);
          callbackFn();
        }
      }, 500);
    }
  }

  return {
    openConnectionWindow,
    connecting,
  };
}

export { useIntegrationPopup };
