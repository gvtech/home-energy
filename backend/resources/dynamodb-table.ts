export default {
  HomeEnergyDynamoDbTable: {
    Type: 'AWS::DynamoDB::Table',
    Properties: {
      TableName: '${self:custom.homeEnergyDynamoDbTable}',
      AttributeDefinitions: [
        {
          AttributeName: 'pk',
          AttributeType: 'S',
        },
        {
          AttributeName: 'sk',
          AttributeType: 'S',
        },
        {
          AttributeName: 'gs1pk',
          AttributeType: 'S',
        },
        {
          AttributeName: 'gs1sk',
          AttributeType: 'S',
        },
        {
          AttributeName: 'gs2pk',
          AttributeType: 'S',
        },
        {
          AttributeName: 'gs2sk',
          AttributeType: 'S',
        },
        {
          AttributeName: 'gs3pk',
          AttributeType: 'S',
        },
        {
          AttributeName: 'gs3sk',
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'pk',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'sk',
          KeyType: 'RANGE',
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'gs1',
          KeySchema: [
            {
              AttributeName: 'gs1pk',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'gs1sk',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
        {
          IndexName: 'gs2',
          KeySchema: [
            {
              AttributeName: 'gs2pk',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'gs2sk',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
        {
          IndexName: 'gs3',
          KeySchema: [
            {
              AttributeName: 'gs3pk',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'gs3sk',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
      ],
      BillingMode: 'PAY_PER_REQUEST',
    },
  },
};
