import axios from 'axios';
import { API_ROUTES } from './API.constants';

axios.interceptors.request.use(function (config) {
    const username = process.env.JIRA_USERNAME;
    const password = process.env.JIRA_TOKEN;
    config.headers.Authorization = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
    config.headers.Accept = 'application/json';
    config.headers['Content-Type'] = 'application/json';
    return config;
});

export default class JiraApi {

    static cache = new Map<string, any[]>();

    static async transitionIssue(issueId: string, transitionId: string) {
        console.log(`Transition issue ${issueId} to ${transitionId}`);
        try {
            await axios.post(API_ROUTES.ISSUE_TRANSITION(issueId), {
                transition: {
                    id: transitionId
                }
            })
            console.log(`Transitioned issue ${issueId} to ${transitionId}`)
        } catch (error) {
            throw error;
        }

    }

    static async getAvailableTransitions(issueId: string) {
        try {
            if (this.cache.has(issueId)) {
                console.log(`returning transitions for issue ${issueId} from cache`);
                return this.cache.get(issueId);
            }
            console.log(`fetching transitions for issue ${issueId}`);
            const response = await axios.get(API_ROUTES.ISSUE_TRANSITION(issueId));
            this.cache.set(issueId, response.data.transitions);
            return response.data.transitions;
        } catch (error) {
            console.error(error)
            throw error;
        }
    }



}