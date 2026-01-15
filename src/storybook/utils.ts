import useTranslationStore from '../store/translations';
import { MOCK_TRANSLATIONS } from './fixtures';

export const mockTranslationStoreData = () => {
  const { setTranslations } = useTranslationStore.getState();
  // @ts-ignore
  setTranslations(MOCK_TRANSLATIONS);
};
