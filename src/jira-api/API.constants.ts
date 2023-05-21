const BASE_URL = 'https://lumel.atlassian.net/rest/api/2';

export class API_ROUTES {
    static BASE_URL = 'https://lumel.atlassian.net/rest/api/2';

    static ISSUE = this.BASE_URL + '/issue';
    static ISSUE_TRANSITION = (issueId: string) => `${this.ISSUE}/${issueId}/transitions`;


}