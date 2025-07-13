/**
 * Check if the given URL is a valid web URL (http or https)
 * @param url - The URL to validate
 * @returns true if the URL is a valid web URL, false otherwise
 */
export const isValidWebUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};
