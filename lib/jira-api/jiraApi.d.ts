export default class JiraApi {
    static transitionIssue(issueId: string, transitionId: string): Promise<void>;
    static getAvailableTransitions(issueId: string): Promise<any>;
}
