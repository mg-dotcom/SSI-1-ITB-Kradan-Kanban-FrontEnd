const MsConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    tenantId: import.meta.env.VITE_AZURE_TENANT_ID,
    clientSecret: import.meta.env.VITE_AZURE_CLIENT_SECRET,
    authority: import.meta.env.VITE_AZURE_AUTHORITY,
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI,
  },
  cache: {
    cacheLocation: "cookie", // Store the cache in cookies
  },
};

export default MsConfig;
