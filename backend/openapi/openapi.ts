import merge from 'lodash';

import hello from '@functions/hello/openapi';

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
}).merge(hello);
