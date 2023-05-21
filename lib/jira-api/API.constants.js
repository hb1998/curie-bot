"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_ROUTES = void 0;
var BASE_URL = 'https://lumel.atlassian.net/rest/api/2';
var API_ROUTES = /** @class */ (function () {
    function API_ROUTES() {
    }
    var _a;
    _a = API_ROUTES;
    API_ROUTES.BASE_URL = 'https://lumel.atlassian.net/rest/api/2';
    API_ROUTES.ISSUE = _a.BASE_URL + '/issue';
    API_ROUTES.ISSUE_TRANSITION = function (issueId) { return "".concat(_a.ISSUE, "/").concat(issueId, "/transitions"); };
    return API_ROUTES;
}());
exports.API_ROUTES = API_ROUTES;
//# sourceMappingURL=API.constants.js.map