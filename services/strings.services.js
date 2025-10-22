const crypto = require("node:crypto");
const { fetchStrings } = require("../repositories/string.repository");
const {
  BadRequestError,
  ConflictError,
  UnprocessableError,
  NotFoundError,
  InternalServerError,
} = require("../utils/AppError");
const repository = require("../repositories/string.repository");
const {
  chechIsPalindrome,
  countUniqueCharacters,
  parseNaturalLanguage,
} = require("../utils/workers");

const analyzeString = async (stringValue) => {
  try {
    if (!stringValue) {
      throw new BadRequestError({
        details: "Missing string value",
        message: "",
        suggestion: "",
      });
    }

    if (typeof stringValue !== "string") {
      throw new UnprocessableError({
        details: "Invalid value",
        message: "value must be of data type 'string'",
        suggestion: "Convert value to string",
      });
    }

    const analyzedString = await repository.fetchSingleString(stringValue);
    if (analyzedString) {
      throw new ConflictError({
        details: "String already analyzed",
        message: "",
        suggestion: "Send another string",
      });
    }

    const words = stringValue.split(" "); // Every words in the strings separated by whitespace
    const hashedString = crypto.hash("sha256", stringValue);
    const [unique_characters, character_frequency] =
      countUniqueCharacters(stringValue);

    const newAnalyzedString = await repository.insertString({
      id: hashedString,
      value: stringValue,
      properties: {
        length: stringValue.length,
        is_palindrome: chechIsPalindrome(stringValue),
        unique_characters,
        word_count: words.length,
        sha256_hash: hashedString,
        character_frequency_map: character_frequency,
      },
      created_at: new Date().toISOString(),
    });

    return newAnalyzedString;
  } catch (error) {
    throw error;
  }
};

const fetchAllStringsWithFiltering = async ({
  is_palindrome,
  min_length,
  max_length,
  word_count,
  contains_character,
} = {}) => {
  try {
    if (
      (!is_palindrome && typeof is_palindrome !== "boolean") ||
      (!min_length && typeof min_length !== "number") ||
      (!max_length && typeof max_length !== "number") ||
      (!word_count && typeof word_count !== "number") ||
      (!contains_character && typeof contains_character !== "string")
    ) {
      throw new BadRequestError({
        details: "invalid query parameters",
        message:
          "The type of the query parameters are invalid or some parameters are missing",
        suggestion: "Check and validate the qery paramters you provided",
      });
    }
    const fileteredAnalyzedStrings = await fetchStrings({
      is_palindrome,
      min_length,
      max_length,
      word_count,
      contains_character,
    });

    return fileteredAnalyzedStrings;
  } catch (error) {
    throw error;
  }
};

const fetchAllStringsWithNaturalLanguage = async (query) => {
  try {
    const filters = parseNaturalLanguage(query);
    const filteredAnalyzedStrings = await await repository.fetchStrings(
      filters
    );

    return [filteredAnalyzedStrings, filters];
  } catch (error) {
    throw error;
  }
};

const fetchSingleString = async (stringValue) => {
  try {
    const analyzedString = await repository.fetchSingleString(stringValue);

    if (!analyzedString) {
      throw new NotFoundError({
        details: "String not found",
        message: "",
        suggestion: "",
      });
    }

    return analyzedString;
  } catch (error) {
    throw error;
  }
};

const deleteString = async (stringValue) => {
  try {
    const analyzedString = await repository.fetchSingleString(stringValue);
    if (!analyzedString) {
      throw new NotFoundError({
        details: "String not found",
        message: "",
        suggestion: "",
      });
    }

    await repository.deleteString(stringValue);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  analyzeString,
  fetchAllStringsWithFiltering,
  fetchAllStringsWithNaturalLanguage,
  fetchSingleString,
  deleteString,
};
