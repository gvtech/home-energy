/**
 * @group acceptance
 */
import { describe, expect, test } from '@jest/globals';
import { StatusCodes } from 'http-status-codes';
import { Errors } from '@libs/utils/errors';
import { executeLambda, generateValidatedAPIGatewayProxyEvent } from '@libs/tests/mocks';
import { getDataFromJSONResponse, getMessageFromJSONResponse } from '@libs/adapter/aws/api-gateway';
import { main } from './handler';

describe('createConsumption acceptance', () => {
  test('Should return a message', async () => {
    // Given
    const message = 'simple message !';

    // When
    const event = generateValidatedAPIGatewayProxyEvent({
      pathParameters: { message },
    });
    const response = await executeLambda(main, event);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(getDataFromJSONResponse(response)).toEqual(message);
  });
});
