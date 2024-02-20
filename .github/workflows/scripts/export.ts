import { Octokit } from "@octokit/rest";
import axios from "axios";

async function main() {
  const octokit = new Octokit({
    auth: process.env.GITHUB_ACCESS_TOKEN,
  });

  const uids = process.env.COLLECTION_UIDS?.split(",") ?? [];
  const endpoint = process.env?.ENDPOINT as string;
  const token = process.env?.ORDZAAR_BEARER_TOKEN as string;
  const secretKey = process.env?.ORDZAAR_SECRET_KEY as string;

  await Promise.all(
    uids.map(async (uid) => {
      const contents = await axios.post(
        endpoint,
        {
          collectionUid: uid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-lambda-bot": secretKey,
          },
        },
      );
      console.log(contents.data.meta.name);
    }),
  );
}

main().then(() => console.log("Done!"));
