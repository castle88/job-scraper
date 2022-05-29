const axios = require("axios");

const { Job, JobMap } = require("../models/Jobs");
const database = require("../config/database");

const scrapeJobs = require("./scraper");

const addData = async () => {
  try {
    const links = await scrapeJobs();

    console.log("scrape start");

    links.forEach(async (link) => {
      await createLink(link);
    });

    console.log(`updated on ${makeDate()}`);
  } catch (err) {
    console.log(err);
  }
};

const createLink = async (link) => {
  try {
    JobMap(database);
    const dupe = await Job.findOne({
      where: {
        title: link.title,
      },
    });
    //     console.log(dupe);
    if (!dupe) {
      const newLink = await Job.create({ ...link, createdAt: `${makeDate()}` });
      await updateLink(newLink);
    }
  } catch (err) {
    console.log(err);
  }
};

// update job posting link to shrink link
const updateLink = async (link) => {
  try {
    JobMap(database);
    await axios.post("https://shrinkenator.herokuapp.com/api/link", {
      url: link.link,
      name: link._id,
    });

    await Job.update(
      { link: `https://shrinkenator.herokuapp.com/${link.id}` },
      {
        where: {
          id: link.id,
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
};

// return array of job objects
const getJobs = async () => {
  try {
    JobMap(database);

    const today = makeDate();
    const jobs = await Job.findAll({ where: { createdAt: today } });

    // console.log(jobs);

    return jobs;
  } catch (err) {
    console.log(err);
  }
};

// convert todays job objects to discord bot strings
const jobCommand = async () => {
  try {
    JobMap(database);

    const jobs = await getJobs();
    const jobjectToStr = jobs.map(
      (job) =>
        `company: ${job.companyName}\ntitle: ${job.title}\nurl: ${job.link}\ndate collected: ${job.createdAt}\n\n`
    );

    return jobjectToStr.reverse();
  } catch (err) {
    console.log(err);
  }
};

// auto message first 5 items in array
const formatMessage = async () => {
  try {
    JobMap(database);

    const jobs = await jobCommand();

    return jobs.slice(0, 5).join("");
  } catch (err) {
    console.log(err);
  }
};

const getJobsByDay = async (date) => {
  try {
    JobMap(database);

    const jobs = await Job.findAll({ where: { createdAt: date } });
    if (!jobs || jobs.length <= 0) {
      return `Bammer, no jobs available on ${date}`;
    }

    const formatJobs = jobs.map(
      (job) =>
        `company: ${job.companyName}\ntitle: ${job.title}\nurl: ${job.link}\ndate collected: ${job.createdAt}\n\n`
    );
    return formatJobs;
  } catch (err) {
    console.log(err);
  }
};

const makeDate = () => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const year = now.getFullYear();

  return `${month}/${day}/${year}`;
};

module.exports = { addData, formatMessage, jobCommand, getJobsByDay };
