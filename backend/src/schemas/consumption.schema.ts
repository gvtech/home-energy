import { getCurrentFileName, getCurrentFolderPath } from '@libs/utils/handler-resolver';

const filePath = getCurrentFolderPath(__filename);

export default {
  type: 'object',
  title: getCurrentFileName(filePath),
  additionalProperties: false,
  properties: {
    consumptionDate: { type: 'string', title: 'consumptionDate' },
    consumption: { type: 'array', title: 'consumption', items: { type: 'number' } },
    deviceNumber: { type: 'number', title: 'deviceNumber' },
    details: { type: 'array', title: 'details', items: {} },
  },
  required: ['consumptionDate', 'consumption', 'deviceNumber', 'details'],
} as const;
