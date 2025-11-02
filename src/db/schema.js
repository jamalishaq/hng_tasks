// import { sql } from "drizzle-orm";
import {
  mysqlTable,
  serial,
  int,
  varchar,
  timestamp,
  decimal,
  real,
} from "drizzle-orm/mysql-core";

export const countries = mysqlTable("countries", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }),
  capital: varchar({ length: 255 }),
  region: varchar({ length: 255 }),
  population: int(),
  currency_code: varchar({ length: 10 }),
  exchange_rate: decimal({ precision: 20, scale: 2 }),
  estimated_gdp: decimal({ precision: 20, scale: 1 }),
  flag_url: varchar({ length: 255 }),
  last_refreshed_at: varchar({ length: 255 }),
});
