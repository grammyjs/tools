const capitalizeFirstLetter = (word: string) => `${word.charAt(0).toUpperCase()}${word.split("").slice(1).join("")}`;
export const snakeToSentenceCase = (words: string) => capitalizeFirstLetter(words).replace(/_/g, " ");

export const snakeToTitleCase = (words: string) => words.split("_").map(capitalizeFirstLetter).join(" ");
