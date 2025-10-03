export default function regexInvalidInput(stringToCheck: string) {
  const invalidChars: string[] = [];
  const allowedCharsRegex = /[a-zA-Z\d&!?'.-]/;

  for (let i = 0; i < stringToCheck.length; i++) {
    const char = stringToCheck[i];

    if (char === " ") {
      // Invalid if double space
      if (stringToCheck[i - 1] === " ") {
        invalidChars.push("extra spaces");
      }
      // ✅ Allowed if in middle or at the very end
    } else if (!allowedCharsRegex.test(char)) {
      invalidChars.push(char);
    }
  }

  return invalidChars.length ? invalidChars : null;
}

//aka if anything is returned, there was invalid input

// Spaces can appear only between words.
// No spaces at the end.
// No double spaces.
// Only allowed characters are used a-z &'-
