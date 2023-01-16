import { getCurrentFolderName } from '@libs/utils/handler-resolver';
import { Routes } from 'src/routes';

const SERVICE_NAME = 'serverless';

export function getDescription(folderPath: string): object {
  const currentFolder = getCurrentFolderName(folderPath);
  return {
    summary: currentFolder,
    description: currentFolder,
    operationId: currentFolder,
  };
}

export function getServiceTag(): string {
  return SERVICE_NAME;
}

export function generatePathParameterConfig(route: Routes): object[] {
  const pathParameterConfig = [];
  const pathParameters = getPathParameters(route);
  for (const pathParameter of pathParameters) {
    pathParameterConfig.push({
      name: pathParameter,
      in: 'path',
      required: true,
      description: pathParameter,
      schema: {
        type: 'string',
      },
    });
  }
  return pathParameterConfig;
}

function getPathParameters(route: Routes): string[] {
  const parameters = route.match(/\{(.*?)\}/g);
  return parameters?.map((parameter) => parameter.replace(/{/g, '').replace(/}/g, '')) ?? [];
}
