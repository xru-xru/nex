import React from 'react';
import MainContent from '../components/MainContent';
import { AttributionTable } from './components/AttributionTable';

function Attributions() {
  return (
    <MainContent className="sectionToPrint">
      <AttributionTable />
    </MainContent>
  );
}

export default Attributions;
