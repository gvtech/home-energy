import { Platforms } from '@models/adapter.model';
import { Routes } from './../../routes';

export const getHttpRoute = (platform: Platforms, route: Routes) => {
  const routeFormat = {
    [Platforms.EXPRESS]: route.replace(/{/g, ':').replace(/}/g, ''),
    [Platforms.AWS]: route,
  };
  return routeFormat[platform];
};
