"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = exports.getMicrosoftAccessToken = exports.getMicrosoftAuthUrl = void 0;
const msal_node_1 = require("@azure/msal-node");
const microsoft_config_1 = require("../config/microsoft.config");
const msalConfig = {
    auth: {
        clientId: microsoft_config_1.microsoftConfig.auth.clientId,
        authority: microsoft_config_1.microsoftConfig.auth.authority,
        clientSecret: microsoft_config_1.microsoftConfig.auth.clientSecret,
    },
    system: {
        loggerOptions: {
            logLevel: msal_node_1.LogLevel.Verbose,
            piiLoggingEnabled: false,
        },
    },
};
let cca = null;
if (microsoft_config_1.microsoftConfig.auth.clientId && microsoft_config_1.microsoftConfig.auth.clientSecret) {
    cca = new msal_node_1.ConfidentialClientApplication(msalConfig);
}
else {
    console.warn('Microsoft Auth credentials not configured. Skipping MSAL initialization.');
}
const getMicrosoftAuthUrl = async () => {
    if (!cca) {
        throw new Error('Microsoft Auth not configured');
    }
    const authUrlParameters = {
        scopes: ['user.read', 'mail.read'],
        redirectUri: microsoft_config_1.microsoftConfig.auth.redirectUri,
    };
    return cca.getAuthCodeUrl(authUrlParameters);
};
exports.getMicrosoftAuthUrl = getMicrosoftAuthUrl;
const getMicrosoftAccessToken = async (code) => {
    if (!cca) {
        throw new Error('Microsoft Auth not configured');
    }
    const tokenRequest = {
        code,
        scopes: ['user.read', 'mail.read'],
        redirectUri: microsoft_config_1.microsoftConfig.auth.redirectUri,
    };
    const response = await cca.acquireTokenByCode(tokenRequest);
    return response;
};
exports.getMicrosoftAccessToken = getMicrosoftAccessToken;
const getUserInfo = async (accessToken) => {
    // Este endpoint obtiene la información del usuario desde Microsoft Graph
    const response = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch user info from Microsoft Graph');
    }
    return response.json();
};
exports.getUserInfo = getUserInfo;
//# sourceMappingURL=microsoftAuthService.js.map