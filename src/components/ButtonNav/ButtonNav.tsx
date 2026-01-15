import React from 'react';
import { NavLink } from 'react-router-dom';

import ButtonBase from '../ButtonBase';

// Comment: this is for testing mainly to keep the testing
// convention we established. React-Router-Dom automatically
// adds the "active" class on the "NavLink" if active.
export const classes = {
  active: 'active',
};
const ButtonNav = React.forwardRef<HTMLButtonElement, any>(function ButtonNav(props, ref) {
  return <ButtonBase as={NavLink} ref={ref} {...props} />;
});
export default ButtonNav;
