import React from 'react';
import { createRoot } from 'react-dom/client';

import addAmChartsLicense from './components/Charts/utils/addLicense';

import App from './App';
import { unregister } from './registerServiceWorker';

const container = document.getElementById('root');
const root = createRoot(container);

if (!container) {
  throw new Error('no container element found');
}

addAmChartsLicense();
root.render(<App />);
unregister();
