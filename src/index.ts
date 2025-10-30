import middy from "@middy/core";
import { handlerFn } from "./handler";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = middy<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
>().handler(handlerFn);
