
export class API_ROUTES {
    static BASE_URL = (project: string) => `https://dev.azure.com/lumel/${project}/_apis/wit/workitems`;

    static ISSUE_URL = (issueId: string, project: string) => `${this.BASE_URL(project)}/${issueId}?api-version=7.2-preview.3`;


}