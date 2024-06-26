import axios from 'axios';
import { API_ROUTES } from './API.constants';


axios.interceptors.request.use(function (config) {
    const username = process.env.AZURE_DEVOPS_USERNAME;
    const password = process.env.AZURE_DEVOPS_TOKEN;
    config.headers.Authorization = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
    config.headers.Accept = 'application/json';
    return config;
});

export const repoProjectMap = {
    'Inforiver': ['visualbis/ibcslibrary'],
    'Inforiver Analytics': ['visualbis/inforiver-charts'],
    'Inforiver MTE': ['visualbis/InforiverMDM'],
    'ValQ Enterprise': ['visualbis/valq', 'visualbis/ValqPowerBI'],
    'ValQ Project': ['visualbis/valq', 'visualbis/ValqPowerBI'],
    'xViz Visuals': ['visualbis/xviz'],

}
export const enum IssueState {
    NEW = "New", // when the issue is created
    IN_DEVELOPMENT = "In Development", // when dev starts to work on the issue
    IN_CODE_REVIEW = "In Code Review", // when dev raises the pr
    DEVELOPMENT_SIGN_OFF = "Development Sign Off", // when the pr is merged
    IN_TESTING = "In Testing", // when the build is updated
}


export default class AzureDevopsApi {


    static getIssueDetails(issueId: string, project: string) {
        return axios.get(API_ROUTES.ISSUE_URL(issueId, project))
    }

    static transitionIssue(issueId: string, project: string, state: IssueState) {
        return axios.patch(API_ROUTES.ISSUE_URL(issueId, project), [{
            from: null,
            op: "add",
            path: "/fields/System.State",
            value: state
        }], {
            headers: {
                'Content-Type': 'application/json-patch+json'
            }
        })
    }


}