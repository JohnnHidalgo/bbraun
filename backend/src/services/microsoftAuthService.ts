import {
  PublicClientApplication,
  Configuration,
  ConfidentialClientApplication,
  AuthorizationCodeRequest,
  LogLevel,
} from '@azure/msal-node';
import { microsoftConfig } from '../config/microsoft.config';

const msalConfig: Configuration = {
  auth: {
    clientId: microsoftConfig.auth.clientId,
    authority: microsoftConfig.auth.authority,
    clientSecret: microsoftConfig.auth.clientSecret,
  },
  system: {
    loggerOptions: {
      logLevel: LogLevel.Verbose,
      piiLoggingEnabled: false,
    },
  },
};

let cca: ConfidentialClientApplication | null = null;

if (microsoftConfig.auth.clientId && microsoftConfig.auth.clientSecret) {
  cca = new ConfidentialClientApplication(msalConfig);
} else {
  console.warn('Microsoft Auth credentials not configured. Skipping MSAL initialization.');
}

export const getMicrosoftAuthUrl = async () => {
  if (!cca) {
    throw new Error('Microsoft Auth not configured');
  }
  const authUrlParameters = {
    scopes: ['user.read', 'mail.read'],
    redirectUri: microsoftConfig.auth.redirectUri,
  };

  return cca.getAuthCodeUrl(authUrlParameters);
};

export const getMicrosoftAccessToken = async (code: string) => {
  if (!cca) {
    throw new Error('Microsoft Auth not configured');
  }
  const tokenRequest: AuthorizationCodeRequest = {
    code,
    scopes: ['user.read', 'mail.read'],
    redirectUri: microsoftConfig.auth.redirectUri,
  };

  const response = await cca.acquireTokenByCode(tokenRequest);
  return response;
};

export const getUserInfo = async (accessToken: string) => {
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
