import type { ProxyOptions } from 'vite';

/**
 * 设置网络代理
 * @param isOpenProxy - 是否开启代理
 * @param envConfig - env环境配置
 */
export function createViteProxy(isOpenProxy: boolean, envConfig: ServiceEnvConfigWithProxyPattern) {
  if (!isOpenProxy) return undefined;

	// console.log('envConfig------', envConfig)

  const proxy: Record<string, string | ProxyOptions> = {
    [envConfig.proxyPattern]: {
      target: envConfig.url,
      changeOrigin: true,
      rewrite: path => path.replace(new RegExp(`^${envConfig.proxyPattern}`), '')
    },
		[envConfig.proxyPattern2]: {
      target: envConfig.url2,
      changeOrigin: true,
			secure: false,
      rewrite: path => path.replace(new RegExp(`^${envConfig.proxyPattern2}`), '')
    },
		[envConfig.proxyPattern3]: {
      target: envConfig.url3,
      changeOrigin: true,
			secure: false,
      rewrite: path => path.replace(new RegExp(`^${envConfig.proxyPattern3}`), '')
    }
  };

	// console.log('proxy------', proxy)

  return proxy;
}
