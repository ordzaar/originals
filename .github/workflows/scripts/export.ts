import { Octokit } from "@octokit/rest";


async function main() {
  const octokit = new Octokit({
    auth: process.env.GITHUB_ACCESS_TOKEN
  });

  const COLLECTION_UIDS: any = await octokit.rest.actions.getEnvironmentVariable({
    repository_id: 728652590,
    environment_name: 'Production',
    name: 'COLLECTION_UIDS'
  });

  const uids = COLLECTION_UIDS.value?.split(',') ?? [];

  console.log(uids);
}

main().then(() => console.log('Done!'));
