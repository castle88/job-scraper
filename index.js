require("dotenv").config({ path: "./config/.env" });
const cron = require("node-cron");
const token = process.env.TOKEN;

const { Client } = require("discord.js");

const {
  addData,
  formatMessage,
  jobCommand,
  getJobsByDay,
} = require("./services/data-interactions");

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

    // all jobs for day of query
    if (msg.content === "!jobs") {
      const jobs = await jobCommand();
      if (!jobs || jobs.length < 1) return msg.reply("bammer no jobs yet!");

      jobs.forEach((job) => msg.reply(job));
      // jobs.forEach((job) => console.log(job));
    }

    // specific day query
    if (msg.content.split(" ")[0] === "!day") {
      // console.log(msg.content.split(" "));
      const dayQuery = msg.content.split(" ")[1];
      // console.log(dayQuery);
      const jobs = await getJobsByDay(dayQuery);
      if (typeof jobs === "string") {
        return msg.reply(jobs);
        // console.log(jobs);
      } else {
        // jobs.forEach((job) => msg.reply(job));
        msg.reply(jobs.reverse().slice(0, 5).join(""));
        // jobs.forEach((job) => console.log(job));
      }
    }
  } catch (err) {
    console.log(err);
  }
});

// Login to Discord with your client's token
client.login(token);

cron.schedule("* * * * *", async () => {
  console.log("scraping");
  await addData();
});

// cron.schedule("0 7,9,12,15,18,21 * * *", async () => {
cron.schedule("* * * * *", async () => {
  try {
    const channel = client.channels.cache.get("962442426075709540");
    // channel.send();
    const jobs = await formatMessage();
    channel.send(jobs);
  } catch (err) {
    console.log(err);
  }
});
