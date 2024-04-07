import { getServiceEnvConfig } from '~/.env-config';
import { createRequest } from './request';

const { url, proxyPatter2 } = getServiceEnvConfig(import.meta.env);

const isHttpProxy = import.meta.env.VITE_HTTP_PROXY === 'Y';

export const request = createRequest({ baseURL: isHttpProxy ? proxyPatter2 : url });

export const mockRequest = createRequest({ baseURL: '/mock' });
