import axios from 'axios';
import { API_ROUTES } from './API.constants';

axios.interceptors.request.use(function (config) {
    const username = process.env.JIRA_USERNAME;
    const password = process.env.JIRA_TOKEN;
    config.headers.Authorization = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`

    return config;
});

export default class JiraApi {

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
        console.log(`Get available transitions for issue ${issueId}`);
        try {
            const response = await axios.get(API_ROUTES.ISSUE_TRANSITION(issueId));
            return response.data.transitions;
        } catch (error) {
            throw error;
        }
    }



}