export const MAX_TEXT_LENGTH = 150;

export function truncate(text) {
  return text.slice(0, MAX_TEXT_LENGTH).trim();
}
