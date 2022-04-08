const axios = require("axios");

const Job = require("../models/Jobs");
const scrapeJobs = require("./scraper");

const addData = async () => {
  try {
    const links = await scrapeJobs();
    links.forEach(async (link) => {
      await createLink(link);
    });

    console.log(`updating on ${makeDate()}`);

    updateLinks();
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
      Job.create({ ...link, createdAt: `${makeDate()}` });
    }
  } catch (err) {
    console.log(err);
  }
};

const updateLinks = async () => {
  try {
    const links = await Job.find();
    if (!links) {
      throw new Error("no links found");
    }

    // console.log(links);

    links.forEach(async (link) => {
      const shrinkLink = await axios.post(
        "https://shrinkenator.herokuapp.com/api/link",
        {
          url: link.link,
          name: link._id,
        }
      );

      await Job.findByIdAndUpdate(link._id, {
        link: `https://shrinkenator.herokuapp.com/${link._id}`,
      });
    });

    console.log(`updated on ${makeDate()}`);
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

module.exports = addData;
