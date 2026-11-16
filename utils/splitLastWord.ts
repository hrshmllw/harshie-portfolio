/**
 * Splits text into everything up to (and including) the last space, and the
 * last word. Wrap the last word and a trailing icon in `whitespace-nowrap`
 * so the icon always sits right after the text and never wraps alone.
 */
export function splitLastWord(text: string): [head: string, last: string] {
  const i = text.lastIndexOf(" ");
  return [text.slice(0, i + 1), text.slice(i + 1)];
}
