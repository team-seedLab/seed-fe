export const getSelfCheckAnswerLength = (answer: string) =>
  Array.from(answer).filter((character) => !/\s/u.test(character)).length;
