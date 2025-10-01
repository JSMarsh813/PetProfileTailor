export default function normalizeString(content) {
  const normalized = content
    .trim()
    .replace(/\s+/g, " ")
    // Collapses multiple spaces into one.
    .replace(/[^\w\s]/g, "")
    //[^\w\s] is a negated character class, meaning “anything not a word character (\w) or whitespace (\s)”.
    // So .replace(/[^\w\s]/g, "") removes all punctuation and special characters, leaving only letters, numbers, underscores, and spaces.
    .toLowerCase();
  return normalized;
}
