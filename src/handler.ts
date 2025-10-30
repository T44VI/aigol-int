import {
  APIGatewayEventDefaultAuthorizerContext,
  APIGatewayProxyEventBase,
  Context,
} from "aws-lambda";
import { Shipment } from "./types";
import { createHash } from "node:crypto";

export const handlerFn = async (
  event: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>,
  context: Context
) => {
  const body = event.body ? JSON.parse(event.body) : null;

  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid request body" }),
    };
  }

  const shipment: Shipment = body;

  const id = createHash("md5")
    .update(
      `${shipment.origin.address}-${shipment.destination.address}-${shipment.productCode}`
    )
    .digest("base64")
    .slice(0, -2);

  return {
    statusCode: 200,
    body: JSON.stringify({ ...shipment, id }),
  };
};
