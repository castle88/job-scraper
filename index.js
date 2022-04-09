require("dotenv").config({ path: "./config/.env" });
const cron = require("node-cron");
const token = process.env.TOKEN;

const { Client, Intents } = require("discord.js");

const connectDB = require("./config/database");
const { addData, formatMessage } = require("./services/data-interactions");
const scrapeJobs = require("./services/scraper");
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

cron.schedule("* 7,9,12,15,18,21 * * *", async () => {
  const channel = client.channels.cache.get("962138514613477396");
  // channel.send();
  const jobs = await formatMessage();
  channel.send(jobs);
});
