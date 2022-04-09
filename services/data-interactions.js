const axios = require("axios");

const Job = require("../models/Jobs");
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
    const dupe = await Job.findOne({
      title: link.title,
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

const updateLink = async (link) => {
  try {
    await axios.post("https://shrinkenator.herokuapp.com/api/link", {
      url: link.link,
      name: link._id,
    });

    await Job.findByIdAndUpdate(link._id, {
      link: `https://shrinkenator.herokuapp.com/${link._id}`,
    });
  } catch (err) {
    console.log(err);
  }
};

const getJobs = async () => {
  try {
    const today = makeDate();
    const jobs = await Job.find({ createdAt: today });

    // console.log(jobs);

    return jobs;
  } catch (err) {
    console.log(err);
  }
};

const formatMessage = async () => {
  try {
    const jobs = await getJobs();
    const jobjectToStr = jobs.map(
      (job) =>
        `company: ${job.companyName}\ntitle: ${job.title}\nurl: ${job.link}\ndate collected: ${job.createdAt}\n\n`
    );

    // return jobjectToStr.join("");
    return jobjectToStr.slice(0, 5).join("");
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

module.exports = { addData, formatMessage };
