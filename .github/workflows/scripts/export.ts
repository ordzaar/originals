import { Octokit } from "@octokit/core";
import axios from "axios";
import {createOrUpdateTextFile} from "@octokit/plugin-create-or-update-text-file";

async function main() {
  const MyOctokit = Octokit.plugin(createOrUpdateTextFile);
  const octokit = new MyOctokit({
    auth: process.env.GITHUB_ACCESS_TOKEN,
  });

  const uids = process.env.COLLECTION_UIDS?.split(",") ?? [];
  const endpoint = process.env?.ENDPOINT as string;
  const token = process.env?.ORDZAAR_BEARER_TOKEN as string;
  const secretKey = process.env?.ORDZAAR_SECRET_KEY as string;
  const pathKey = process.env?.ORDZAAR_PATH_KEY as string;

  await Promise.all(
    uids.map(async (uid) => {
      const contents = await axios.post(
        `${endpoint}?x-allow-key=${pathKey}`,
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

      const {
        updated,
        data,
      } = await octokit.createOrUpdateTextFile({
        owner: "ordzaar",
        repo: "originals",
        path: `collections/${uid}/inscription.json`,
        content: contents.data.inscriptions,
        message: `chore(bot): update ${uid} hashlist`,
      });
      console.log(data);
    }),
  );
}

main().then(() => console.log("Done!"));
