/* Amplify Params - DO NOT EDIT
	API_REALTIMECHAT_GRAPHQLAPIIDOUTPUT
	API_REALTIMECHAT_ROOMTABLE_ARN
	API_REALTIMECHAT_ROOMTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/*
This is the Node.js code for your getUserRoomCountLambda function.
File path: amplify/backend/function/getUserRoomCountLambda/src/index.js

This function returns the number of rooms created by the current user.
*/

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");

// Initialize the DynamoDB Document Client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Get table names from environment variables provided by Amplify
const ROOM_TABLE_NAME = process.env.API_REALTIMECHAT_ROOMTABLE_NAME;

/**
 * @type {import('@types/aws-lambda').AppSyncResolverHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const userId = event.identity.sub; // The ID of the user

  if (!userId) {
    throw new Error("User not authenticated.");
  }

  try {
    // Count how many rooms the user has created
    const scanParams = {
      TableName: ROOM_TABLE_NAME,
      FilterExpression: "#owner = :userId",
      ExpressionAttributeNames: {
        "#owner": "owner"
      },
      ExpressionAttributeValues: {
        ":userId": userId
      },
      Select: "COUNT"
    };

    const scanResult = await docClient.send(new ScanCommand(scanParams));
    const roomCount = scanResult.Count || 0;

    console.log(`User ${userId} has created ${roomCount} rooms`);
    return roomCount;

  } catch (error) {
    console.error("Error getting user room count:", error);
    throw new Error("Failed to get user room count.");
  }
};
