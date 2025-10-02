export default function bannedWordsMessage(content, blockedBy, type) {
  if (type === "substring") {
    return `Ruh Roh! ${content} could not be added because any content containing the phrase ${blockedBy} is not allowed.`;
  } else if (type === "exact-name") {
    return `Ruh Roh! ${content} could not be added because the word ${blockedBy} cannot be used by itself.`;
  } else {
    return `Ruh Roh! ${content} could not be added because the word ${blockedBy} is on the blocklist.`;
  }
}
