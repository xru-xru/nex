import React from 'react';
import { nexyColors } from 'theme';

const ZoomOutButton = ({ onClick }: { onClick: () => void }) => (
  <button
    style={{
      position: 'absolute',
      top: 6,
      right: 48,
      background: nexyColors.lilac,
      color: '#fff',
      border: 'none',
      borderRadius: '50%',
      width: 30,
      height: 30,
      fontSize: 18,
      fontWeight: 'bold',
      cursor: 'pointer',
      zIndex: 100,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'opacity 0.2s',
    }}
    onClick={onClick}
    aria-label="Zoom out"
    data-cy="zoomOutButton"
  >
    -
  </button>
);

export default ZoomOutButton; 