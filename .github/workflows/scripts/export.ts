import { Octokit } from "@octokit/rest";


async function main() {
  const octokit = new Octokit({
    auth: process.env.GITHUB_ACCESS_TOKEN
  });

  const uids = process.env.COLLECTION_UIDS?.split(',') ?? [];

  console.log(uids);
}

main().then(() => console.log('Done!'));
