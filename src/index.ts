import { Probot } from "probot";
import JiraApi from "./jira-api/jiraApi";

const idPatternRegex = (issuePrefixes: string[]) => new RegExp(`\\b(${issuePrefixes.join('|')})-(\\d+)\\b`, "gi");

const issuePrefixes = ["XPS", "VBI", "XPC", "VALQ"];

const transitions = {
  InCodeReview: "251",
  DevSignOff: "361",
  InTesting: "231",
  InDevelopment: "371"
} as const;

const eventTransitionMap = {
  BeforeReview: transitions.InCodeReview,
  AfterMerge: transitions.DevSignOff,
  AfterClose: transitions.InDevelopment
} as const;


export = (app: Probot) => {
  app.on("pull_request", async (context) => {
    const pull_request = context.payload.pull_request;
    const action: string = context.payload.action;
    const prContents = [pull_request.title, pull_request.body]
    const issueIdRegex = idPatternRegex(issuePrefixes);
    const issueIds = prContents.join(" ").match(issueIdRegex);
    const uniqueIssueIds = getUniqueMembers(issueIds);
    if (uniqueIssueIds.length) {
      for await (const issueId of uniqueIssueIds) {
        try {
          const getAvailableTransitions = async () => await JiraApi.getAvailableTransitions(issueId);
          if (["reopened", "opened"].includes(action)) {
            const transitionId = eventTransitionMap.BeforeReview;
            const availableTransitions = await getAvailableTransitions();
            if (availableTransitions.some((transition) => transition.id === transitionId)) {
              await JiraApi.transitionIssue(issueId, transitionId);
            } else {
              console.log(`No transition available ${issueId}`)
            }
          }
          else if (action === "closed" && pull_request.merged) {
            const transitionId = eventTransitionMap.AfterMerge;
            const availableTransitions = await getAvailableTransitions();
            if (availableTransitions.some((transition) => transition.id === transitionId)) {
              await JiraApi.transitionIssue(issueId, transitionId);
            } else {
              console.log(`No transition available ${issueId}`)
            }
          } else {
            console.log(`No required events for issue ${issueId}`)
          }
        } catch (error) {
          console.error(error)
        }
      }
    }
    else {
      console.log(`No issue id found in ${prContents}`);
    }
  });
};

const getUniqueMembers = (array: string[]) => array.filter((value, index, array) => array.indexOf(value) === index);
