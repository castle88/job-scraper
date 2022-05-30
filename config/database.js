const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PW,
  host: process.env.PG_HOST,
  port: process.env.DB_PORT,
  database: process.env.PG_DATABASE,
});

module.exports = pool;
