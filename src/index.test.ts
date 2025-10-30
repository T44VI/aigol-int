import {
  APIGatewayEventDefaultAuthorizerContext,
  APIGatewayProxyEventBase,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { handler } from "./index.js";
import { ShipmentRequest } from "./types.js";

const testShipmentFn = async (
  shipment: ShipmentRequest,
  productCode?: string
): Promise<APIGatewayProxyResult> => {
  const event: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext> =
    {
      resource: "/hello",
      path: "/hello",
      httpMethod: "GET",
      headers: {
        "Content-Type": "application/json",
        Host: "example.execute-api.us-east-1.amazonaws.com",
        "User-Agent": "jest",
      },
      multiValueHeaders: {
        "Content-Type": ["application/json"],
      },
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      pathParameters: null,
      stageVariables: null,
      body: shipment
        ? JSON.stringify(productCode ? { ...shipment, productCode } : shipment)
        : null,
      isBase64Encoded: false,
      requestContext: {
        accountId: "123456789012",
        apiId: "api-id",
        authorizer: {
          principalId: "user",
        },
        httpMethod: "GET",
        identity: {
          accessKey: null,
          accountId: null,
          apiKey: null,
          apiKeyId: null,
          caller: null,
          cognitoAuthenticationProvider: null,
          cognitoAuthenticationType: null,
          cognitoIdentityId: null,
          cognitoIdentityPoolId: null,
          principalOrgId: null,
          sourceIp: "127.0.0.1",
          user: null,
          userAgent: "jest",
          userArn: null,
          clientCert: null,
        },
        path: "/dev/hello",
        protocol: "HTTP/1.1",
        requestId: "test-request-id",
        requestTime: "01/Jan/2020:00:00:00 +0000",
        requestTimeEpoch: 1577836800000,
        resourcePath: "/hello",
        stage: "dev",
        resourceId: "",
      },
    };

  const context: Context = {
    callbackWaitsForEmptyEventLoop: false,
    functionName: "test-function",
    functionVersion: "$LATEST",
    invokedFunctionArn:
      "arn:aws:lambda:us-east-1:123456789012:function:test-function",
    memoryLimitInMB: "128",
    awsRequestId: "test-request-id",
    logGroupName: "/aws/lambda/test-function",
    logStreamName: "2020/01/01/[$LATEST]test",
    identity: undefined,
    clientContext: undefined,
    getRemainingTimeInMillis: () => 3000,
    done: (_err?: Error | string | null, _result?: any) => {},
    fail: (_err?: Error | string) => {},
    succeed: (_messageOrObject?: any) => {},
  };

  return await handler(event, context);
};

test("handler returns a successful response", async () => {
  const shipment: ShipmentRequest = {
    origin: {
      name: "Sender Name",
      address: "123 Sender St",
      city: "Sender City",
      postalCode: "12345",
      countryCode: "FI",
    },
    destination: {
      name: "Receiver Name",
      address: "456 Receiver Ave",
      city: "Receiver City",
      postalCode: "67890",
      countryCode: "SE",
    },
    packages: [
      {
        id: "pkg1",
        weight: 10,
        dimensions: {
          length: 30,
          width: 20,
          height: 15,
        },
      },
    ],
  };

  const response = await testShipmentFn(shipment);

  expect(response.statusCode).toBe(200);
  expect(JSON.parse(response.body)).toEqual({
    ...shipment,
    id: "7tuMj9hOpXJjkBKfdWKLew",
    productCode: "FLS",
  });
});
