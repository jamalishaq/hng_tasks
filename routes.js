const express = require("express");
const router = express.Router();
const stringController = require("./controllers/strings.controllers");

router
  .route("/strings")
  .post(stringController.analyzeString)
  .get(stringController.fetchAllStringsWithFiltering);

router
  .route("/strings/filter-by-natural-language")
  .get(stringController.fetchAllStringsWithNaturalLanguage);

router
  .route("/strings/:string_value")
  .get(stringController.fetchSingleString)
  .delete(stringController.deleteString);

module.exports = router;
