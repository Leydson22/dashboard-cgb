const STORAGE_KEY = 'cgb_quick_registrations_v1';

const DEFAULT_PREFIXES = ['PR-', 'PS-', 'PT-', 'PP-'];

export const getQuickPrefixes = (): string[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (err) {}
  return DEFAULT_PREFIXES;
};

export const saveQuickPrefixes = (prefixes: string[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefixes));
};

export const addQuickPrefix = (prefix: string) => {
  const prefixes = getQuickPrefixes();
  if (!prefixes.includes(prefix)) {
    const updated = [...prefixes, prefix.toUpperCase()];
    saveQuickPrefixes(updated);
    return updated;
  }
  return prefixes;
};

export const deleteQuickPrefix = (prefix: string) => {
  const prefixes = getQuickPrefixes();
  const updated = prefixes.filter(p => p !== prefix);
  saveQuickPrefixes(updated);
  return updated;
};

export const editQuickPrefix = (oldPrefix: string, newPrefix: string) => {
  const prefixes = getQuickPrefixes();
  const updated = prefixes.map(p => p === oldPrefix ? newPrefix.toUpperCase() : p);
  saveQuickPrefixes(updated);
  return updated;
};
