const Sequelize = require("sequelize").Sequelize;
const { PG_USER, PG_HOST, PG_DATABASE, PG_PW, PG_PORT } = process.env;

module.exports = new Sequelize({
  dialect: "postgres",
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  username: PG_USER,
  password: PG_PW,
});
