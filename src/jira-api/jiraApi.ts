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
        this.cache.set("VBI-9458", [
            {
                "id": "381",
                "name": "Blocked",
                "to": {
                    "self": "https://lumel.atlassian.net/rest/api/2/status/11816",
                    "description": "",
                    "iconUrl": "https://lumel.atlassian.net/images/icons/statuses/generic.png",
                    "name": "Blocked",
                    "id": "11816",
                    "statusCategory": {
                        "self": "https://lumel.atlassian.net/rest/api/2/statuscategory/2",
                        "id": 2,
                        "key": "new",
                        "colorName": "blue-gray",
                        "name": "To Do"
                    }
                },
                "hasScreen": false,
                "isGlobal": true,
                "isInitial": false,
                "isAvailable": true,
                "isConditional": false,
                "isLooped": false
            },
            {
                "id": "391",
                "name": "Needs Clarification",
                "to": {
                    "self": "https://lumel.atlassian.net/rest/api/2/status/13205",
                    "description": "Needs Clarification",
                    "iconUrl": "https://lumel.atlassian.net/images/icons/statuses/generic.png",
                    "name": "Needs Clarification",
                    "id": "13205",
                    "statusCategory": {
                        "self": "https://lumel.atlassian.net/rest/api/2/statuscategory/2",
                        "id": 2,
                        "key": "new",
                        "colorName": "blue-gray",
                        "name": "To Do"
                    }
                },
                "hasScreen": false,
                "isGlobal": true,
                "isInitial": false,
                "isAvailable": true,
                "isConditional": false,
                "isLooped": false
            },
            {
                "id": "251",
                "name": "Code Review",
                "to": {
                    "self": "https://lumel.atlassian.net/rest/api/2/status/12120",
                    "description": "",
                    "iconUrl": "https://lumel.atlassian.net/images/icons/statuses/generic.png",
                    "name": "In Code Review",
                    "id": "12120",
                    "statusCategory": {
                        "self": "https://lumel.atlassian.net/rest/api/2/statuscategory/4",
                        "id": 4,
                        "key": "indeterminate",
                        "colorName": "yellow",
                        "name": "In Progress"
                    }
                },
                "hasScreen": false,
                "isGlobal": false,
                "isInitial": false,
                "isAvailable": true,
                "isConditional": false,
                "isLooped": false
            },
            {
                "id": "481",
                "name": "Revert to To-Do",
                "to": {
                    "self": "https://lumel.atlassian.net/rest/api/2/status/1",
                    "description": "The issue is open and ready for the assignee to start work on it.",
                    "iconUrl": "https://lumel.atlassian.net/images/icons/statuses/open.png",
                    "name": "To-Do",
                    "id": "1",
                    "statusCategory": {
                        "self": "https://lumel.atlassian.net/rest/api/2/statuscategory/2",
                        "id": 2,
                        "key": "new",
                        "colorName": "blue-gray",
                        "name": "To Do"
                    }
                },
                "hasScreen": false,
                "isGlobal": false,
                "isInitial": false,
                "isAvailable": true,
                "isConditional": false,
                "isLooped": false
            }
        ])
        try {
            if (this.cache.has(issueId)) {
                console.log(`returning transitions for issue ${issueId} from cache`);
                return this.cache.get(issueId);
            }
            // console.log(`fetching transitions for issue ${issueId}`);
            console.log(API_ROUTES.ISSUE_TRANSITION(issueId));
            const response = await axios.get(API_ROUTES.ISSUE_TRANSITION(issueId));
            console.log(response, 'fetched')
            this.cache.set(issueId, response.data.transitions);
            return response.data.transitions;
        } catch (error) {
            console.error(error)
            throw error;
        }
    }



}