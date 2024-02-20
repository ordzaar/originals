import { Octokit } from "@octokit/core";
import axios from "axios";

async function main() {
  const octokit = new Octokit({
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

      const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: 'ordzaar',
        repo: 'originals',
        path: `collections/${uid}/inscription.json`,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })


      await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
        owner: "ordzaar",
        repo: "originals",
        path: `collections/${uid}/inscription.json`,
        message: `chore(bot): update ${uid} hashlist`,
        content: btoa(contents.data.inscriptions),
        sha: response.data['sha'],
        committer: {
          name: "Ordo",
          email: "engineering@ordzaar.com",
        },
        headers: {
          accept: "application/vnd.github+json",
        },
      });
    }),
  );
}

main().then(() => console.log("Done!"));
