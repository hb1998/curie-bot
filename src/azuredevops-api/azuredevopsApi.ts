import axios from 'axios';
import { API_ROUTES } from './API.constants';

axios.interceptors.request.use(function (config) {
    const username = process.env.AB_USERNAME;
    const password = process.env.AB_TOKEN;
    config.headers.Authorization = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
    config.headers.Accept = 'application/json';
    config.headers['Content-Type'] = 'application/json';
    return config;
});

export default class AzureDevopsApi {


    static async getIssueDetails(issueId: string) {
        try {
            const response = await axios.get(API_ROUTES.ISSUE_URL(issueId))
        } catch (error) {
            console.error(`Error get details of ${issueId}`)
            throw error;
        }

    }


}