const chechIsPalindrome = (stringValue) => {
  const value = stringValue.toLowerCase().split(" ").join(""); //To ensure case sensitivity
  let left = 0;
  let right = value.length - 1;

  while (left < right) {
    if (value[left] !== value[right]) {
      return false;
    }
    left += 1;
    right -= 1;
  }
  return true;
};

const countUniqueCharacters = (stringValue) => {
  const value = stringValue.toLowerCase(); // To ensure case sensitivity
  const character_frequency_map = {};

  for (let i = 0; i < value.length; i++) {
    if (value[i] === " ") {
      continue;
    }

    if (!(value[i] in character_frequency_map)) {
      character_frequency_map[value[i]] = 1;
    } else {
      character_frequency_map[value[i]] += 1;
    }
  }

  const unique_characters = Object.keys(character_frequency_map);

  return [unique_characters.length, character_frequency_map];
};

const parseNaturalLanguage = (query) => {
  const words = query.split(" ");
  let len;
  let letter;
  for (let i = 0; i < words.length; i++) {
    if (Number(words[i])) {
      len = Number(words[i]);
    }

    if (words[i].length === 1) {
      letter = words[i];
    }
  }

  const tokens = [
    "palindromic",
    "single word",
    `longer than ${len}`,
    "first vowel",
    `containing the letter ${letter}`,
  ];

  for (let i = 0; i < tokens.length; i++) {
    if (query.includes(tokens[i])) {
      break;
    }

    if (i === tokens.length - 1) {
      throw new BadRequestError({
        details: "Unable o parse natural language query",
        message: "",
        suggestion: ""
      });
    }
  }

  const filters = {};

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === "palindromic" && query.includes(tokens[i])) {
      filters.is_palindrome = true;
    } else if (tokens[i] === "single word" && query.includes(tokens[i])) {
      filters.word_count = 1;
    } else if (
      tokens[i] === `longer than ${len}` &&
      query.includes(tokens[i])
    ) {
      filters.min_length = len + 1;
    } else if (tokens[i] === "first vowel" && query.includes(tokens[i])) {
      filters.contains_character = "a";
    } else if (
      tokens[i] === `containing the letter ${letter}` &&
      query.includes(tokens[i])
    ) {
      filters.contains_character = letter;
    }
  }

  return filters;
};

module.exports = {
    chechIsPalindrome, 
    countUniqueCharacters,
    parseNaturalLanguage
}

