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
    'Inforiver': [
        'lumelinc/InforiverMatrix',
        "lumelinc/turing-api",
        "lumelinc/turing-cron",
        "lumelinc/turing-app",
        "lumelinc/turing-worker",
        "lumelinc/turing-orchestrator"
    ],
    'Inforiver Analytics': ['lumelinc/inforiver-charts'],
    'EDITable': [
        'lumelinc/InforiverMDM',
        'lumelinc/turing-app',
        'lumelinc/turing-audit',
        'lumelinc/turing-api',
        'lumelinc/turing-mdm-worker',
        'lumelinc/turing-orchestrator',
        'lumelinc/database-servicelink',
    ],
    'Power Tables': [
        'lumelinc/InforiverMDM',
        'lumelinc/turing-app',
        'lumelinc/turing-audit',
        'lumelinc/turing-api',
        'lumelinc/turing-mdm-worker',
        'lumelinc/turing-orchestrator',
        'lumelinc/database-servicelink',
        'lumelinc/FabricApp'
    ],
    'Fabric App':[
        'lumelinc/InforiverMDM',
        'lumelinc/turing-app',
        'lumelinc/turing-audit',
        'lumelinc/turing-api',
        'lumelinc/turing-mdm-worker',
        'lumelinc/turing-orchestrator',
        'lumelinc/database-servicelink',
        'lumelinc/FabricApp',
        'lumelinc/InforiverMatrix'
    ],
    'ValQ Enterprise': ['lumelinc/valq', 'lumelinc/ValqPowerBI'],
    'ValQ Project': ['lumelinc/valq', 'lumelinc/ValqPowerBI'],
    'xViz Visuals': ['lumelinc/xviz','lumelinc/PerformanceFlow'],
    'Inforiver filter+': ['lumelinc/HTFilter'],

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
        try {    
            return axios.get(API_ROUTES.ISSUE_URL(issueId, project))
        } catch (error) {
            console.log('Error in getIssueDetails', error);
            throw error;
        }
    }

    static transitionIssue(issueId: string, project: string, state: IssueState) {
        try {
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
        } catch (error) {
            console.log('Error in transitionIssue', error);
            throw error;
        }
    }


}
