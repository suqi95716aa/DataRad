import { handleModuleRoutes } from '@/utils';

const modules = import.meta.glob('./**/*.ts', { eager: true }) as AuthRoute.RouteModule;

console.log('modules-----', modules)

export const routes = handleModuleRoutes(modules);
