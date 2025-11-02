import {
  batchInsertCountriesRepository,
  batchUpdateCountriesRepository,
  getAllCountriesWithQueryRepository,
  getAllCountriesRepository,
  getCountryByNameRepository,
  deleteCountryByNameRepository,
  getStatusRepository,
} from "../repositories/repositories.js";
import { ServiceUnavailableError } from "../utils/AppError.js";
import {
  generatePNG,
  findTopFiveCountries,
  getLastRefreshTime,
  getSummaryImage,
  setLastRefreshTime,
} from "../utils/workers.js";
import redis from "../db/connectRedis.js";

// POST /countries/refresh service
export const refreshCountriesService = async () => {
  console.log("Request recieved")
  const countriesResponse = await fetch(
    "https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies"
  );

  if (!countriesResponse.ok) {
    throw new ServiceUnavailableError({
      error: "External data source unavailable",
      details: "Could not fetch data from restcountries API",
    });
  }

  const countries = await countriesResponse.json();
  console.log(countries);

  const exchangeRatesResponse = await fetch(
    "https://open.er-api.com/v6/latest/USD"
  );

  if (!exchangeRatesResponse.ok) {
    throw new ServiceUnavailableError({
      error: "External data source unavailable",
      details: "Could not fetch data from exchnagerate API",
    });
  }

  const { rates } = await exchangeRatesResponse.json();
  const last_refreshed_at = new Date().toISOString();

  // Step 1: Load all existing countries from database once
  const existingCountries = await getAllCountriesRepository();

  // Step 2: Cache countries in Redis (lowercase name -> actual name mapping)
  const countryNamesMap = new Map(); // lowercase -> actual name
  const redisPipeline = redis.pipeline();

  for (const country of existingCountries) {
    const lowerName = country.name.toLowerCase();
    countryNamesMap.set(lowerName, country.name);
    redisPipeline.set(`country:${lowerName}`, country.name);
    redisPipeline.expire(`country:${lowerName}`, 3600); // 1 hour expiration
  }

  // Execute pipeline for caching existing countries
  if (existingCountries.length > 0) {
    await redisPipeline.exec();
  }

  // Step 3: Batch check Redis cache for all countries at once
  const redisCheckPipeline = redis.pipeline();

  countries.forEach((country) => {
    console.log("checking redis")
    const lowerName = country.name.toLowerCase();
    redisCheckPipeline.get(`country:${lowerName}`);
  });

  // Execute all Redis GET operations in one batch
  const cachedResults = await redisCheckPipeline.exec();

  // Step 4: Prepare batches for insert and update
  const countriesToInsert = [];
  const countriesToUpdate = [];
  const countryNamesForUpdate = new Map(); // lowercase -> actual name for updates
  const redisUpdatePipeline = redis.pipeline();

  for (let i = 0; i < countries.length; i++) {
    const country = countries[i];
    const lowerName = country.name.toLowerCase();

    // Get cached result from batch operation
    const cachedResult = cachedResults[i];
    const cachedName =
      cachedResult && cachedResult[1] !== null ? cachedResult[1] : null;
    const existsInCache = cachedName !== null;

    // If not in cache, check the in-memory map as fallback
    const existsInMap = countryNamesMap.has(lowerName);
    const countryExists = existsInCache || existsInMap;

    // Generate random multiplier between 1000-2000 for each country
    const randomMultiplier = 1000 + Math.random() * 1000; // 1000-2000 range

    const countryData = {
      name: country.name,
      capital: country.capital ? country.capital : "",
      region: country.region,
      population: country.population,
      currency_code:
        country?.currencies?.length > 0 ? country?.currencies[0].code : null,
      exchange_rate:
        country?.currencies?.length > 0 && rates[country?.currencies[0].code]
          ? rates[country?.currencies[0].code]
          : null,
      estimated_gdp:
        country?.currencies?.length > 0 && rates[country?.currencies[0].code]
          ? (country.population * randomMultiplier) /
            rates[country?.currencies[0].code]
          : 0,
      flag_url: country.flag,
      last_refreshed_at: last_refreshed_at,
    };

    if (countryExists) {
      // Use cached name or map name for update
      const originalName = cachedName || countryNamesMap.get(lowerName);
      countriesToUpdate.push(countryData);
      countryNamesForUpdate.set(lowerName, originalName);

      // Queue Redis cache update in pipeline
      redisUpdatePipeline.set(`country:${lowerName}`, country.name);
      redisUpdatePipeline.expire(`country:${lowerName}`, 3600);
    } else {
      countriesToInsert.push(countryData);

      // Queue Redis cache update in pipeline
      redisUpdatePipeline.set(`country:${lowerName}`, country.name);
      redisUpdatePipeline.expire(`country:${lowerName}`, 3600);
    }
  }

  // Execute Redis pipeline for cache updates
  if (countries.length > 0) {
    await redisUpdatePipeline.exec();
  }

  // Step 5: Execute batch database operations
  const batchPromises = [];
  if (countriesToInsert.length > 0) {
    const insertResult = await batchInsertCountriesRepository(
      countriesToInsert
    );
  }

  if (countriesToUpdate.length > 0) {
    batchPromises.push(
      batchUpdateCountriesRepository(countriesToUpdate, countryNamesForUpdate)
    );
  }

  await Promise.all(batchPromises);

  // Step 6: Get updated results
  const result = await getAllCountriesRepository();
  console.log(result);
  setLastRefreshTime(last_refreshed_at);

  generatePNG(
    result.length,
    findTopFiveCountries(result),
    await getLastRefreshTime()
  );

  return result;
};

// GET /countries service
export const getAllCountriesService = async (query) => {
  return await getAllCountriesWithQueryRepository(query);
};

// GET /countries/:name service
export const getCountryByNameService = async (name) => {
  return await getCountryByNameRepository(name);
};

// DELETE /countries/:name service
export const deleteCountryByNameService = async (name) => {
  return await deleteCountryByNameRepository(name);
};

// GET /status service
export const getStatusService = async () => {
  console.log("Called")
  return await getStatusRepository();
};

// GET /countries/image service
export const getSummaryImageService = async () => {
  return await getSummaryImage();
};
