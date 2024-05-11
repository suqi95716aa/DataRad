import { getServiceEnvConfig } from '~/.env-config';
import { createRequest } from './request';

const { url, proxyPattern3 } = getServiceEnvConfig(import.meta.env);

const isHttpProxy = import.meta.env.VITE_HTTP_PROXY === 'Y';

export const request = createRequest({ baseURL: isHttpProxy ? '' : url });

export const kbRequest = createRequest({ baseURL: isHttpProxy ? proxyPattern3 : url }); // 知识库

export const mockRequest = createRequest({ baseURL: '/mock' });
