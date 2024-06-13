
export class API_ROUTES {
    static BASE_URL = 'https://dev.azure.com/lumel/inforiver/_apis/wit/workitems';

    static ISSUE_URL = (issueId: string) => `${this.BASE_URL}?ids=${issueId}/&api-version=7.2-preview.3`;


}