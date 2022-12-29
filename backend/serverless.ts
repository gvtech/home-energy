import type { AWS } from '@serverless/typescript';

// Resources
import dynamoDbTable from 'resources/dynamodb-table';

// Functions
import hello from './src/functions/hello';

const serverlessConfiguration: AWS = {
  service: 'home-energy-backend',
  frameworkVersion: '3',
  custom: {
    stage: '${opt:stage, env:AWS_STAGE, "dev"}',
    stageType: ' ${env:STAGE_TYPE, "dev"}',
    envType: '${env:ENV_TYPE, "dev"}',
    prefix: '${self:custom.stage}-${self:service}',
    hostedZoneName: '${env:HOSTED_ZONE, "${self:custom.envType}.typescript.hostedZone"}',
    apiDomainName: 'api.${self:custom.hostedZoneName}',
    apiBasePath: 'api-${self:custom.stage}-${self:service}',
    homeEnergyDynamoDbTable: '${self:provider.stage}-${self:service}-home-energy-dynamodb-table',
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
      loader: { '.html': 'text' },
    },
  },
  plugins: ['serverless-esbuild', 'serverless-deployment-bucket', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    stage: '${self:custom.stage}',
    region: 'eu-west-3',
    environment: {
      AWS_STAGE: '${self:custom.stage}',
    },
    deploymentBucket: {
      name: '${self:service}-${self:custom.envType}-${self:provider.region}-deployment-bucket',
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:DescribeTable',
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
              'dynamodb:BatchWriteItem',
              'dynamodb:BatchGetItem',
            ],
            Resource: [
              {
                'Fn::GetAtt': ['HomeEnergyDynamoDbTable', 'Arn'],
              },
              {
                'Fn::Sub': '${HomeEnergyDynamoDbTable.Arn}/index/*',
              },
            ],
          },
        ],
      },
    },
  },
  functions: {
    hello,
  },
  package: {
    // When true optimise lambda performance but increase deployment time
    individually: !!process.env.STAGE_TYPE && process.env.STAGE_TYPE !== 'dev',
  },
  resources: {
    Resources: Object.assign(dynamoDbTable),
    Outputs: {
      ApiURL: {
        Value: 'https://${self:custom.apiDomainName}/${self:custom.apiBasePath}',
      },
    },
  },
};

module.exports = serverlessConfiguration;
