import { Probot } from "probot";
import AzureDevopsApi, { IssueState, repoProjectMap } from "./azuredevops-api/azuredevopsApi";



export = (app: Probot) => {
  app.on("pull_request", async (context) => {
    const pull_request = context.payload.pull_request;
    const action: string = context.payload.action;
    const prContents = [pull_request.title, pull_request.body]
    // ?<= is the lookbehind operator, its added to not have "AB" in the matched results but still have in the condition.
    const issueIdRegex = /(?<=AB#)\d+/g;
    const issueIds = prContents.join(" ").match(issueIdRegex);
    const uniqueIssueIds = getUniqueMembers(issueIds);
    console.log('Repo Full Name', context.payload.repository.full_name);
    console.log('Sender', context.payload.sender.login);
    if (uniqueIssueIds.length) {
      console.log('ids found', issueIds)
      for await (const issueId of uniqueIssueIds) {
        try {
          const repoName = context.payload.repository.full_name;
          const project = getProjectName(repoName);
          console.log('repo Name', repoName);
          if (!project) {
            console.log(`No project found for ${repoName}`);
            continue;
          }
          const response = await AzureDevopsApi.getIssueDetails(issueId, project);
          const state = response.data?.fields?.['System.State'];
          if (["reopened", "opened"].includes(action) && [IssueState.NEW, IssueState.IN_DEVELOPMENT].includes(state)) {
            await AzureDevopsApi.transitionIssue(issueId, project, IssueState.IN_CODE_REVIEW,);
            console.log(`moved ${issueId} from ${state} to ${IssueState.IN_CODE_REVIEW}`)
          }
          else if (action === "closed" && pull_request.merged && state === IssueState.IN_CODE_REVIEW) {
            await AzureDevopsApi.transitionIssue(issueId, project, IssueState.DEVELOPMENT_SIGN_OFF);
            console.log(`moved ${issueId} from ${state} to ${IssueState.DEVELOPMENT_SIGN_OFF}`)
          } else {
            console.log(`invalid state for the available transition. state -> ${state}, action -> ${action}, issue -> ${issueId}`)
          }
        } catch (error) {
          console.log(`Error is Issue ${issueId} from ${context.payload.sender.login} of ${context.payload.repository.full_name}`)
          console.error(error.message)
        }
      }
    }
    else {
      console.log(`No issue id found in ${prContents}`);
    }

  });
};

const getProjectName = (repoName: string) => {
  const project = Object.keys(repoProjectMap).find(key => repoProjectMap[key].includes(repoName))
  return project ? encodeURI(project) : null
}

const getUniqueMembers = (array: string[]) => array.filter((value, index, array) => array.indexOf(value) === index);
