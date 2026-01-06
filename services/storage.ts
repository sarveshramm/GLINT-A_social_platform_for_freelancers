
/**
 * Simple LocalStorage manager for persistent mock data
 */
export const Storage = {
  get: <T,>(key: string): T | null => {
    const data = localStorage.getItem(`glint_${key}`);
    return data ? JSON.parse(data) : null;
  },
  set: (key: string, value: any): void => {
    localStorage.setItem(`glint_${key}`, JSON.stringify(value));
  },
  remove: (key: string): void => {
    localStorage.removeItem(`glint_${key}`);
  },
  clear: (): void => {
    Object.keys(localStorage)
      .filter(k => k.startsWith('glint_'))
      .forEach(k => localStorage.removeItem(k));
  }
};
