export default function bannedWordsMessage(content, blockedBy, type) {
  if (type === "substring") {
    return `Ruh Roh! ${content} could not be added because anything containing ${blockedBy} is not allowed.`;
  } else {
    return `Ruh Roh! ${content} could not be added because ${blockedBy} is not allowed.`;
  }
}
