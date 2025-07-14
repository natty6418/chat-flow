export const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID,
      userPoolClientSecret: import.meta.env.VITE_AWS_USER_POOL_CLIENT_SECRET,
      loginWith: {
        email: false,
        username: true,
      },
      region: import.meta.env.VITE_AWS_REGION
    }
  },
  API: {
    GraphQL: {
      endpoint: import.meta.env.VITE_AWS_GRAPHQL_ENDPOINT,
      region: import.meta.env.VITE_AWS_REGION,
      defaultAuthMode: 'AMAZON_COGNITO_USER_POOLS',
      // defaultAuthMode: 'userPool',
      apiKey: import.meta.env.VITE_AWS_GRAPHQL_API_KEY,
      realTime: {
        subscriptionEndpoint: import.meta.env.VITE_AWS_REALTIME_ENDPOINT,
        region: import.meta.env.VITE_AWS_REGION,
      }
    }
  }
} as const;

export default awsConfig;
