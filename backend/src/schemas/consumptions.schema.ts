import { getCurrentFileName, getCurrentFolderPath } from '@libs/utils/handler-resolver';
import ConsumptionSchema from '@schemas/consumption.schema';

const filePath = getCurrentFolderPath(__filename);

export default {
  type: 'array',
  title: getCurrentFileName(filePath),
  items: ConsumptionSchema,
} as const;
