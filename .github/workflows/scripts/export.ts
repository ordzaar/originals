import { Octokit } from "octokit";


async function main() {
  const octokit = new Octokit({
    auth: process.env.GITHUB_ACCESS_TOKEN
  });

  const COLLECTION_UIDS: any = await octokit.request('GET /repositories/originals/environments/Production/variables/COLLECTION_UIDS');
  const uids = COLLECTION_UIDS.value?.split(',') ?? [];

  console.log(uids);
}

main().then(() => console.log('Done!'));
