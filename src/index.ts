import { Probot } from "probot";

const idPatternRegex = (issuePrefixes: string[]) => new RegExp(`\\b(${issuePrefixes.join('|')})-(\\d+)\\b`, "gi");



export = (app: Probot) => {
  app.on("pull_request", async (context) => {
    const pull_request = context.payload.pull_request;
    const action: string = context.payload.action;
    const prContents = [pull_request.title, pull_request.body]
    const issueIdRegex = idPatternRegex(issuePrefixes);
    const issueIds = prContents.join(" ").match(issueIdRegex);
    const uniqueIssueIds = getUniqueMembers(issueIds);
  
  });
};

const getUniqueMembers = (array: string[]) => array.filter((value, index, array) => array.indexOf(value) === index);
