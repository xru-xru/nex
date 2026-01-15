import usePresenterMode from '../hooks/usePresenterMode';
import Sidebar from '../components/Sidebar';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const PrivateApp = ({ children }: Props) => {
  const { isPresenterMode } = usePresenterMode();
  return (
    <div style={{ minHeight: '100vh' }}>
      {!isPresenterMode && <Sidebar />}
      {children}
    </div>
  );
};

export default PrivateApp;
