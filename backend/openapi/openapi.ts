import merge from 'lodash';

// Functions
// import createAllConsumption from '@functions/createAllConsumption/openapi';
import createConsumption from '@functions/createConsumption/openapi';
// import getAllConsumption from '@functions/getAllConsumption/openapi';

// Schemas
import ConsumptionSchema from '@schemas/consumption.schema';

export default merge({
  openapi: '3.0.0',
  info: {
    title: 'ProjectAPI',
    description: 'API to create and manage projects on the platform',
    version: '0.1.0',
  },
  servers: [
    {
      url: `https://XXXXXXXXX.execute-api.${process.env.AWS_REGION ?? 'eu-west-3'}.amazonaws.com/${process.env.AWS_STAGE}`,
      description: 'API access through API Gateway direct domain',
    },
  ],
  components: {
    schemas: {
      ConsumptionSchema: ConsumptionSchema,
    },
  },
}).merge(createConsumption);
// }).merge(createAllConsumption, createConsumption, getAllConsumption);
