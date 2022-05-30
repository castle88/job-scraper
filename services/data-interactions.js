const axios = require("axios");
const pool = require("../config/database");
const scrapeJobs = require("./scraper");

const addData = async () => {
  try {
    const links = await scrapeJobs();

    console.log("scrape start");

    links.forEach(async (link) => {
      await createLink(link);
    });

    // const data = await pool.query("SELECT * FROM jobs");
    // console.log(data);

    console.log(`updated on ${makeDate()}`);
  } catch (err) {
    console.log(err);
  }
};

const createLink = async (link) => {
  try {
    const dupe = await pool.query("SELECT * FROM jobs WHERE id = $1;", [
      link.id,
    ]);
    if (dupe.rows.length < 1) {
      const shrinkLink = await updateLink(link);
      const servername = shrinkLink.request.socket.servername;
      const crushedID = shrinkLink.data.crushedLink.name;
      // console.log("*********", shrinkLink.request.socket.servername);
      // console.log(shrinkLink.data.crushedLink._id);
      await pool.query(
        "INSERT INTO jobs (id, title, company, clocation, link, createdat) VALUES ($1, $2, $3, $4, $5, $6);",
        [
          link.id,
          link.title,
          link.company,
          link.location,
          `https://${servername}/${crushedID}`,
          makeDate(),
        ]
      );
    }
  } catch (err) {
    console.log(err);
  }
};

// update job posting link to shrink link
const updateLink = async (link) => {
  try {
    const newLink = await axios.post(
      "https://shrinkenator.herokuapp.com/api/link",
      {
        url: link.link,
        name: link.id,
      }
    );

    // console.log("************", newLink);
    return newLink;
  } catch (err) {
    console.log(err);
  }
};

// return array of job objects
const getJobs = async () => {
  try {
    const today = makeDate();
    const jobs = await pool.query(
      "SELECT * FROM jobs WHERE createdat = ($1);",
      [today]
    );

    console.log(jobs.rows);

    return jobs.rows;
  } catch (err) {
    console.log(err);
  }
};

// convert todays job objects to discord bot strings
const jobCommand = async () => {
  try {
    const jobs = await getJobs();
    const jobjectToStr = jobs.map(
      (job) =>
        `company: ${job.company}\ntitle: ${job.title}\nurl: ${job.link}\ndate collected: ${job.createdat}\n\n`
    );

    return jobjectToStr.reverse();
  } catch (err) {
    console.log(err);
  }
};

// auto message first 5 items in array
const formatMessage = async () => {
  try {
    const jobs = await jobCommand();

    return jobs.slice(0, 5).join("");
  } catch (err) {
    console.log(err);
  }
};

const getJobsByDay = async (date) => {
  try {
    const jobs = await pool.query("SELECT * FROM jobs WHERE createdat = ($1)", [
      date,
    ]);
    if (!jobs || jobs.length <= 0) {
      return `Bammer, no jobs available on ${date}`;
    }

    const formatJobs = jobs.map(
      (job) =>
        `company: ${job.company}\ntitle: ${job.title}\nurl: ${job.link}\ndate collected: ${job.createdat}\n\n`
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
// module.exports = { addData };
