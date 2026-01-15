import useTranslationStore from '../store/translations';

export const getNoTranslationString = (string: string): string => string.slice(string.indexOf('}') + 1);

function useTranslation() {
  const { translations } = useTranslationStore();

  function translate(key: string | null | undefined = ''): string {
    const k = key || 'No data';

    for (const t of translations) {
      if (k === t.key) {
        if (!t.text) {
          return k;
        }

        return t.text;
      }
    }

    return getNoTranslationString(k);
  }

  return {
    translations,
    translate,
  };
}

export { useTranslation };
