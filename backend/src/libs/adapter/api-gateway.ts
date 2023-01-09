import { Platforms } from '@models/adapter.model';
import { Routes } from './../../routes';

export function getHttpRoute(platform: Platforms, route: Routes): string {
  const routeFormat = {
    [Platforms.EXPRESS]: route.replace(/{/g, ':').replace(/}/g, ''),
    [Platforms.AWS]: route,
  };
  return routeFormat[platform];
}
