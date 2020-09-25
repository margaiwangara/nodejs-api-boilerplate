const yargs = require("yargs");
const dotenv = require("dotenv");
const axios = require("axios");

// dotenv config
dotenv.config({ path: `${__dirname}/../config/secret.env` });

(async function versioner() {
  try {
    // get github credentials
    const token = process.env.GITHUB_TOKEN,
      username = process.env.GITHUB_USERNAME,
      repo = process.env.GITHUB_REPO_NAME;

    if (!token || !username || !repo) {
      // console log error
      console.log({
        message: "Token, username and repo fields are required"
      });
      return;
    }

    // testing yargs
    const argv = commands();

    // url to add release
    const URL = `https://api.github.com/repos/${username}/${repo}/releases?access_token=${token}`;

    // check if releases is included
    if (argv._.includes("releases")) {
      // grab data from argv
      const tag = argv.tag;

      if (!tag) {
        console.log("Tag is required");
        return;
      }

      // run axios
      const response = await axios.post(URL, {
        tag_name: tag,
        target_commitish: argv.branch,
        name: argv.name,
        body: argv.body,
        draft: argv.draft,
        prerelease: argv.prerelease
      });

      // destruct response
      const { data, status, statusText } = response;

      // log response
      console.log({
        status,
        message: statusText,
        data
      });
      return;
    }
  } catch (error) {
    console.log(error);
  }
})();

function commands() {
  return yargs
    .command("releases", "Creates a github release.", {
      tag: {
        description: "Required. The name of the tag. eg. v1.0.0",
        alias: "t",
        type: "string"
      },
      branch: {
        description: `Specifies the commitish value that determines where the Git tag is created from. Can be any branch or commit SHA. Unused if the Git tag already exists. Default: the repository's default branch (usually master).`,
        alias: "b",
        type: "string"
      },
      name: {
        description: "The name of the release. eg. v1.0.0",
        alias: "n",
        type: "string"
      },
      body: {
        description: "Text describing the contents of the tag.",
        alias: "c",
        type: "string"
      },
      draft: {
        description: `true to create a draft (unpublished) release, false to create a published one. Default: false`,
        alias: "d",
        type: "boolean"
      },
      prerelease: {
        description: `true to identify the release as a prerelease. false to identify the release as a full release. Default: false`,
        alias: "p",
        type: "boolean"
      }
    })
    .help()
    .alias("help", "h").argv;
}
