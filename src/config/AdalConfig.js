export default {
    tenant: 'b21014a0-74e5-4945-8cda-334a4848eb07',
    clientId: 'cde7f48a-81d2-41d5-abba-77524c89b83a',
    redirectUri: process.env.AUTH_REDIRECT_URI,
    endpoints: {
      // api should be the same as clientID
      api: 'cde7f48a-81d2-41d5-abba-77524c89b83a',
    },
    cacheLocation: 'localStorage',
  };