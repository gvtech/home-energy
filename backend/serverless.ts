import type { AWS } from '@serverless/typescript';
import hello from './src/functions/hello';

const serverlessConfiguration: AWS = {
  service: 'home-energy-backend',
  frameworkVersion: '3',
  custom: {
    stageType: '${opt:stage, env:AWS_STAGE, "dev"}',
    envType: '${env:ENV_TYPE, "dev"}',
    prefix: '${self:custom.stageType}-${self:service}',
    hostedZoneName: '${env:HOSTED_ZONE, "${self:custom.envType}.typescript.hostedZone"}',
    apiDomainName: 'api.${self:custom.hostedZoneName}',
    apiBasePath: 'api-${self:custom.stageType}-${self:service}',
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
    stage: '${self:custom.stageType}',
    region: 'eu-west-3',
    deploymentBucket: {
      name: '${self:service}-${self:custom.envType}-${self:provider.region}-deployment-bucket',
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
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
    Outputs: {
      ApiURL: {
        Value: 'https://${self:custom.apiDomainName}/${self:custom.apiBasePath}',
      },
    },
  },
};

module.exports = serverlessConfiguration;
