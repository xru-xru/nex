import { NexoyaTranslation } from '../types/types';

export const getNoTranslationString = (string: string): string => string.slice(string.indexOf('}') + 1);
export default function translate(translations: NexoyaTranslation[] = [], key: string | null | undefined = ''): string {
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
