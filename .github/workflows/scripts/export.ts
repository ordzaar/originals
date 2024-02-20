import { Octokit } from "@octokit/rest";
import axios from "axios";

async function main() {
  const octokit = new Octokit({
    auth: process.env.GITHUB_ACCESS_TOKEN,
  });

  const uids = process.env.COLLECTION_UIDS?.split(",") ?? [];

  await Promise.all(
    uids.map(async (uid) => {
      const contents = await axios.post(
        process.env?.ENDPOINT,
        {
          collectionUid: uid,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env?.ORDZAAR_BEARER_TOKEN}`,
            "x-lambda-bot": process.env?.ORDZAAR_SECRET_KEY,
          },
        },
      );
      console.log(contents.data.meta.name);
    }),
  );
}

main().then(() => console.log("Done!"));
