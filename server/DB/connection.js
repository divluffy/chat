const { Pool } = require("pg");
require("env2")("config.env");
const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error("link DB not found >>");
}

const options = {
  connectionString: DATABASE_URL,
  ssl: false
};


module.exports = new Pool(options);