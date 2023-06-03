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
            console.error(`Error transitioning issue ${issueId} to ${transitionId}`)
            throw error;
        }

    }

    static async getAvailableTransitions(issueId: string) {
        try {
            console.log(`fetching transitions for issue ${issueId}`);
            const response = await axios.get(API_ROUTES.ISSUE_TRANSITION(issueId));
            return response.data.transitions;
        } catch (error) {
            console.error("Error fetching transitions")
            throw error;
        }
    }



}