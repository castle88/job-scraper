const Pool = require("pg").Pool;
require("dotenv").config({ path: "./env" });

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PW,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
});

module.exports = pool;
