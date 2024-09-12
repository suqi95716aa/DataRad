/** 获取登录页面模块的动态路由的正则 */
export function getLoginModuleRegExp() {
  const modules: UnionKey.LoginModule[] = ['pwd-login', 'code-login', 'register', 'reset-pwd', 'bind-wechat'];
  return modules.join('|');
}

/** 获取首页页面模块的动态路由的正则 */
export function getKnowAnyModuleRegExp() {
  const modules: UnionKey.knowanyModule[] = ['knowany', 'data-source', 'knowledge-base'];
  return modules.join('|');
}
