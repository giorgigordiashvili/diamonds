import 'server-only';

// Define dictionary types based on our JSON structure
type Dictionary = {
  navigation: {
    home: string;
  };
  home: {
    title: string;
    description: string;
    save_changes: string;
    deploy_now: string;
    read_docs: string;
    learn: string;
    examples: string;
    go_to_nextjs: string;
  };
};

// Dictionary loaders for each language
const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  ka: () => import('@/dictionaries/ka.json').then((module) => module.default),
};

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  if (!dictionaries[locale]) {
    // Fallback to English if the locale is not supported
    return dictionaries.en();
  }
  return dictionaries[locale]();
};
