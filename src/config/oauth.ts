interface OAuthConfig {
  clientId: string;
  authEndpoint: string;
  tokenEndpoint: string;
  scope: string[];
  responseType: string;
}

interface OAuthProviders {
  google: OAuthConfig;
  yahoo: OAuthConfig;
  outlook: OAuthConfig;
}

export const oauthConfig: OAuthProviders = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    authEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    scope: ['email', 'profile'],
    responseType: 'code'
  },
  yahoo: {
    clientId: import.meta.env.VITE_YAHOO_CLIENT_ID || '',
    authEndpoint: 'https://api.login.yahoo.com/oauth2/request_auth',
    tokenEndpoint: 'https://api.login.yahoo.com/oauth2/get_token',
    scope: ['openid', 'email', 'profile', 'sdps-r'],
    responseType: 'token'
  },
  outlook: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || '',
    authEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    scope: ['openid', 'email', 'profile', 'offline_access'],
    responseType: 'code'
  }
};
