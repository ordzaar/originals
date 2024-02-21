import { Octokit } from "@octokit/core";
import axios from "axios";

async function main() {
  const octokit = new Octokit({
    auth: process.env.ORDZAAR_BOT_TOKEN,
  });

  const uids = process.env.COLLECTION_UIDS?.split(",") ?? [];
  const endpoint = process.env?.ENDPOINT as string;
  const token = process.env?.ORDZAAR_BEARER_TOKEN as string;
  const secretKey = process.env?.ORDZAAR_SECRET_KEY as string;
  const pathKey = process.env?.ORDZAAR_PATH_KEY as string;
  const headerKey = process.env?.ORDZAAR_HEADER_KEY as string;

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
            [`${headerKey}`]: secretKey,
          },
        },
      );

      let sha = null;
      try {
        const { data } = await octokit.request(
          "GET /repos/{owner}/{repo}/contents/{path}",
          {
            owner: "ordzaar",
            repo: "originals",
            path: `collections/${uid}/inscription.json`,
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
            },
          },
        );
        sha = (data as any).sha ?? null;
      } catch (e) {
        console.error(e);
      }

      console.log(`Updating ${uid}...`);
      await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
        owner: "ordzaar",
        repo: "originals",
        path: `collections/${uid}/inscription.json`,
        message: `chore(bot): update ${uid} hashlist`,
        content: btoa(JSON.stringify(contents.data.inscriptions)),
        sha,
      });
    }),
  );
}

main().then(() => console.log("Done!"));
