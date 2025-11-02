import db from "../db/connectDB.js";
import { eq, desc, count, asc } from "drizzle-orm";
import { countries } from "../db/schema.js";

// POST /countries/refresh repository
export const refreshCountriesRepository = async (countryData) => {
  return await db.insert(countries).values(countryData);
};

export const insertCountryRepository = async (countryData) => {
  return await db.insert(countries).values(countryData);
};

export const updateCountryRepository = async (countryData, name) => {
  return await db
    .update(countries)
    .set(countryData)
    .where(eq(countries.name, name));
};

// Batch insert countries
export const batchInsertCountriesRepository = async (countriesData) => {
  if (countriesData.length === 0) return [];

  return await db.transaction(async (tx) => {
    await tx.insert(countries).values(countriesData);
    // return countriesData; // Explicitly return the inserted data
  });
};

// Batch update countries using transaction
export const batchUpdateCountriesRepository = async (
  countriesData,
  countryNamesMap
) => {
  if (countriesData.length === 0) return [];

  // Execute updates in a transaction
  return await db.transaction(async (tx) => {
    const updatePromises = countriesData.map((countryData) => {
      const originalName = countryNamesMap.get(countryData.name.toLowerCase());
      if (originalName) {
        return tx
          .update(countries)
          .set(countryData)
          .where(eq(countries.name, originalName));
      }
      return Promise.resolve();
    });
    return Promise.all(updatePromises);
  });
};

export const getAllCountriesRepository = async () => {
  return await db.select().from(countries);
};

// GET /countries repository
export const getAllCountriesWithQueryRepository = async (query) => {
  const { sort, region, currency } = query;
  if (!sort && !region && !currency) {
    console.log("Here")
    return await db
      .select()
      .from(countries)
  }

  if (sort) {
    if (sort === "gdp_desc") {
      return await db
        .select()
        .from(countries)
        .orderBy(desc(countries.estimated_gdp));
    } else if (sort === "gdp_asc") {
      return await db
        .select()
        .from(countries)
        .orderBy(asc(countries.estimated_gdp));
    }
  }
  if (region) {
    return await db
      .select()
      .from(countries)
      .where(eq(countries.region, region));
  }
  if (currency) {
    return await db
      .select()
      .from(countries)
      .where(eq(countries.currency_code, currency));
  }
};

// GET /countries/:name repository
export const getCountryByNameRepository = async (name) => {
  return await db.select().from(countries).where(eq(countries.name, name));
};

// DELETE /countries/:name repository
export const deleteCountryByNameRepository = async (name) => {
  return await db.delete(countries);
};

// GET /status repository
export const getStatusRepository = async () => {
  return await db.select({ total_countries: count() }).from(countries);
};
