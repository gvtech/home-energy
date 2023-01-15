import { generatePathParameterConfig, getDescription, getServiceTag } from '@libs/adapter/openapi';
import { getCurrentFolderName, getCurrentFolderPath } from '@libs/utils/handler-resolver';
import { StatusCodes } from 'http-status-codes';
import { Routes } from 'src/routes';

import index from './index';

const route: Routes = index.events[0].http.path as Routes;
const folderPath = getCurrentFolderPath(__dirname);

export default {
  paths: {
    [route]: {
      post: {
        ...getDescription(folderPath),
        tags: [getServiceTag()],
        parameters: [...generatePathParameterConfig(route)],
        responses: {
          [StatusCodes.OK]: {
            description: getCurrentFolderName(folderPath),
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  title: 'consumption', // Function type name
                  properties: {
                    message: { type: 'string' },
                    data: {
                      $ref: '#/components/schemas/ConsumptionSchema',
                    },
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
