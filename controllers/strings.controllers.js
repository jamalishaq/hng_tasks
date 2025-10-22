const stringsService = require("../services/strings.services");

const analyzeString = async (req, res, next) => {
  try {
    const { value: stringValue } = req.body;
    const analyzedString = await stringsService.analyzeString(stringValue);

    return res.status(201).json(analyzedString);
  } catch (error) {
    next(error);
  }
};

const fetchAllStringsWithFiltering = async (req, res, next) => {
  try {
    const {
      is_palindrome,
      min_length,
      max_length,
      word_count,
      contains_character,
    } = req.query;
    const filters = {
      is_palindrome: is_palindrome === "true" ? true : false,
      min_length: Number(min_length),
      max_length: Number(max_length),
      word_count: Number(word_count),
      contains_character,
    };
    const analyzedStrings = await stringsService.fetchAllStringsWithFiltering(
      filters
    );
    const responseData = {
      data: analyzedStrings,
      count: analyzedStrings.length,
      filters_applied: {
        ...filters,
      },
    };
    return res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
};

const fetchAllStringsWithNaturalLanguage = async (req, res, next) => {
  try {
    const { query } = req.query;
    const [analayzedStrings, parsedFilters] =
      await stringsService.fetchAllStringsWithNaturalLanguage(query);
    const responseData = {
      data: analayzedStrings,
      count: 0,
      interpreted_query: {
        original: query,
        parsed_filters: {
          ...parsedFilters,
        },
      },
    };

    return res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
};

const fetchSingleString = async (req, res, next) => {
  try {
    const { string_value } = req.params;
    const analayzedString = await stringsService.fetchSingleString(
      string_value
    );

    return res.status(200).json(analayzedString);
  } catch (error) {
    next(error);
  }
};

const deleteString = async (req, res, next) => {
  const { string_value } = req.params;
  try {
   await  stringsService.deleteString(string_value);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeString,
  fetchAllStringsWithFiltering,
  fetchAllStringsWithNaturalLanguage,
  fetchSingleString,
  deleteString,
};
