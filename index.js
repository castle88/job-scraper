require("dotenv").config({ path: "./config/.env" });
const cron = require("node-cron");
const token = process.env.TOKEN;

const { Client, Intents } = require("discord.js");

const connectDB = require("./config/database");
const addData = require("./services/data-interactions");

connectDB();

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!");
});

// Login to Discord with your client's token
client.login(token);

cron.schedule("0 * * * *", () => {
  addData();
});
