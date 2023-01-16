import { getHttpRoute } from '@libs/adapter/api-gateway';
import { getCurrentFolderPath } from '@libs/utils/handler-resolver';
import { Platforms } from 'src/models/adapter.model';
import { Routes } from 'src/routes';

export default {
  handler: `${getCurrentFolderPath(__dirname)}/handler.main`,
  memorySize: 256,
  events: [
    {
      http: {
        method: 'post',
        path: getHttpRoute(Platforms.AWS, Routes.CREATE_ALL_CONSUMPTION),
      },
    },
  ],
};
