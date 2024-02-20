import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN
});

const uids = process.env.COLLECTION_UIDS?.split(',') ?? [];

console.log(uids);
