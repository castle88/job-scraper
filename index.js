require("dotenv").config({ path: "./config/.env" });
const cron = require("node-cron");

const connectDB = require("./config/database");
const addData = require("./services/data-interactions");

connectDB();

// addData();

cron.schedule("0 * * * *", () => {
  addData();
});
