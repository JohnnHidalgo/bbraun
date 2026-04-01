"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = exports.microsoftConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.microsoftConfig = {
    auth: {
        clientId: process.env.MICROSOFT_CLIENT_ID || '',
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
        authority: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID || 'common'}`,
        redirectUri: process.env.MICROSOFT_REDIRECT_URI || 'http://localhost:3000/api/auth/callback',
    },
    system: {
        loggerOptions: {
            logLevel: 'verbose',
            piiLoggingEnabled: false,
        },
    },
};
exports.jwtConfig = {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
};
//# sourceMappingURL=microsoft.config.js.map