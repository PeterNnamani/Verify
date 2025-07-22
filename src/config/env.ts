interface Config {
  GOOGLE_CLIENT_ID: string;
  YAHOO_CLIENT_ID: string;
  MICROSOFT_CLIENT_ID: string;
}

export const config: Config = {
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  YAHOO_CLIENT_ID: import.meta.env.VITE_YAHOO_CLIENT_ID || '',
  MICROSOFT_CLIENT_ID: import.meta.env.VITE_MICROSOFT_CLIENT_ID || '',
};
