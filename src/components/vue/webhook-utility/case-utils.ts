const capitalizeFirstLetter = (word: string) =>
  `${word.charAt(0).toUpperCase()}${word.split("").slice(1).join("")}`;
export const snakeToSentenceCase = (words: string) => {
  if (words == "added_to_attachment_menu") {
    return "Attachment Menu";
  } else if (words == "can_join_groups") {
    return "Join Groups";
  } else if (words == "can_read_all_group_messages") {
    return "Read All Group Messages";
  } else if (words == "has_custom_certificate") {
    return "Custom Certificate";
  } else if (words == "supports_inline_queries") {
    return "Inline Mode";
  }
  return capitalizeFirstLetter(words).replace(/_/g, " ");
};

export const snakeToTitleCase = (words: string) =>
  words.split("_").map(capitalizeFirstLetter).join(" ");
