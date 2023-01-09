import { getHttpRoute } from '@libs/adapter/api-gateway';
import { Platforms } from '@models/adapter.model';
import { Routes } from 'src/routes';

// TODO: add openapi
export default {
  paths: {
    [getHttpRoute(Platforms.AWS, Routes.GET_ALL_CONSUMPTION)]: {
      get: {
        summary: 'hello message',
        description: 'hello message',
        operationId: 'hello',
        tags: ['userAPI'],
        parameters: [
          {
            name: 'message',
            in: 'path',
            required: true,
            description: 'message',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'hello',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  title: 'display message',
                  properties: {
                    message: { type: 'string' },
                    data: { type: 'string' },
                  },
                  required: ['data'],
                },
              },
            },
          },
        },
      },
    },
  },
} as const;
