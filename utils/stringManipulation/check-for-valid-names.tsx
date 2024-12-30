function regexInvalidInput(stringToCheck: string) {
  let regexForInvalidCharacters = /[^a-z\d&'-]+/;
  return stringToCheck.match(regexForInvalidCharacters);
}
//only strings not matching the a-z digits &'- will be returned
//aka if anything is returned, there was invalid input
export default regexInvalidInput;
