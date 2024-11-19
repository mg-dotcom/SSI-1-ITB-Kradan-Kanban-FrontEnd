export const handleRedirectCallback = async () => {
  try {
    // Initialize MSAL first
    initializeMsal();

    // Handle the redirect callback
    const response = await msalInstance.handleRedirectPromise();
    if (response) {
      console.log("User logged in:", response);
      // You can process the response, e.g., store user info, access token, etc.
    }
  } catch (error) {
    console.error("Error handling redirect:", error);
  }
};

import * as msal from "@azure/msal-browser";

const AZURE_CLIENT_ID = import.meta.env.VITE_AZURE_CLIENT_ID;
const AZURE_TENANT_ID = import.meta.env.VITE_AZURE_TENANT_ID;

const msalConfig = {
  auth: {
    clientId: AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${AZURE_TENANT_ID}`,
    redirectUri: "http://localhost:5173", // Update with your redirect URI
  },
};

let msalInstance = null;

export const initializeMsal = () => {
  if (!msalInstance) {
    msalInstance = new msal.PublicClientApplication(msalConfig);
  }
};

export const signInAzure = async () => {
  try {
    // Initialize MSAL first
    initializeMsal();

    // Trigger login redirect after initialization
    await msalInstance.loginRedirect({
      scopes: ["user.read"], // Add any other required scopes
    });
  } catch (error) {
    console.error("Error during login:", error);
  }
};
