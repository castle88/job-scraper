const axios = require("axios");
const { JSDOM } = require("jsdom");

const scrapeJobs = async () => {
  const indeed =
    "https://www.indeed.com/jobs?q=web%20development&remotejob=032b3046-06a3-4876-8dfd-474eb5e7ed11&vjk=b56679283ea5f012";

  try {
    const { data: html } = await axios.get(indeed, {
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        Host: "www.indeed.com",
        "User-Agent":
          "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:97.0) Gecko/20100101 Firefox/97.0",
        Pragma: "no-cache",
        TE: "trailers",
        "Upgrade-Insecure-Requests": 1,
      },
    });

    const dom = new JSDOM(html);
    const document = dom.window.document;

    const links = Array.from(document.querySelectorAll("a.tapItem")).map(
      (job) => {
        const title = job.querySelector("h2.jobTitle").textContent;
        const companyName = job.querySelector("span.companyName").textContent;
        const companyLocation =
          job.querySelector(".companyLocation").textContent;
        const link =
          "www.indeed.com/viewjob?jk=" +
          job.attributes["id"].textContent.split("_")[1];

        // console.log(link);

        return { title, companyName, companyLocation, link };
      }
    );

    // console.log(links);

    return links;
  } catch (err) {
    console.log(err);
  }
};

module.exports = scrapeJobs;
