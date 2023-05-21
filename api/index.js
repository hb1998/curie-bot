const { createNodeMiddleware, createProbot } = require("probot");

const app = require("../lib");
const probot = createProbot();

module.exports = createNodeMiddleware(app, { probot, webhooksPath: '/api' });