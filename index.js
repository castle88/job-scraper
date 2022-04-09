require("dotenv").config({ path: "./config/.env" });
const cron = require("node-cron");
const token = process.env.TOKEN;

const { Client } = require("discord.js");

const connectDB = require("./config/database");
const {
  addData,
  formatMessage,
  jobCommand,
} = require("./services/data-interactions");

connectDB();

// Create a new client instance
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!");
});

client.on("messageCreate", async (msg) => {
  try {
    if (msg.author.bot) return;

    if (msg.content === "!sup") {
      return msg.reply("hello");
    }

    if (msg.content === "!jobs") {
      const jobs = await jobCommand();
      if (!jobs || jobs.length < 1) return msg.reply("bammer no jobs yet!");

      jobs.forEach((job) => msg.reply(job));
    }
  } catch (err) {
    console.log(err);
  }
});

// Login to Discord with your client's token
client.login(token);

cron.schedule("0 * * * *", () => {
  addData();
});

cron.schedule("0 7,9,12,15,18,21 * * *", async () => {
  // cron.schedule("* * * * *", async () => {
  try {
    const channel = client.channels.cache.get("962138514613477396");
    // channel.send();
    const jobs = await formatMessage();
    channel.send(jobs);
  } catch (err) {
    console.log(err);
  }
});
