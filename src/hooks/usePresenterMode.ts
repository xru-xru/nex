import { isPresenterMode } from '../utils/isPresenterMode';
import useUserStore from '../store/user';

const USER_ROLE_PRESENTER = `{role:readonly}`;
export default function usePresenterMode(): {
  isPresenterMode: boolean;
} {
  const {
    user: { activeRole },
  } = useUserStore();
  return {
    isPresenterMode: isPresenterMode() || activeRole?.name === USER_ROLE_PRESENTER,
  };
}
