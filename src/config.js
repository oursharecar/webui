const env = import.meta.env ?? {};

const backendFallback = '';
const redirectPathFallback = '/callback';

export const backendEndpoint = env.VITE_BACKEND_ENDPOINT ?? backendFallback;

export const auth0Config = {
  domain: env.VITE_AUTH0_DOMAIN ?? '',
  clientId: env.VITE_AUTH0_CLIENT_ID ?? '',
  useRefreshTokens: true,
  cacheLocation: 'localstorage',
  authorizationParams: {
    redirect_uri:
      env.VITE_AUTH0_REDIRECT_URI ??
      `${window.location.origin}${redirectPathFallback}`,
    audience: env.VITE_AUTH0_AUDIENCE ?? '',
  },
};
