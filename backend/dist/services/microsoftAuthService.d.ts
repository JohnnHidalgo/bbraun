export declare const getMicrosoftAuthUrl: () => Promise<string>;
export declare const getMicrosoftAccessToken: (code: string) => Promise<import("@azure/msal-node").AuthenticationResult>;
export declare const getUserInfo: (accessToken: string) => Promise<unknown>;
//# sourceMappingURL=microsoftAuthService.d.ts.map