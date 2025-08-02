/* Amplify Params - DO NOT EDIT
	API_REALTIMECHAT_GRAPHQLAPIIDOUTPUT
	API_REALTIMECHAT_ROOMTABLE_ARN
	API_REALTIMECHAT_ROOMTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/*
This is the Node.js code for your createRoomLambda function.
File path: amplify/backend/function/createRoomLambda/src/index.js

This function creates a new room with validation for the 5-room limit per user.
*/

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { randomUUID } = require("crypto");

// Initialize the DynamoDB Document Client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Get table names from environment variables provided by Amplify
const ROOM_TABLE_NAME = process.env.API_REALTIMECHAT_ROOMTABLE_NAME;

const MAX_ROOMS_PER_USER = 5;

/**
 * @type {import('@types/aws-lambda').AppSyncResolverHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const { name, roomType } = event.arguments;
  const userId = event.identity.sub; // The ID of the user creating the room

  if (!userId) {
    throw new Error("User not authenticated.");
  }

  if (!name || !roomType) {
    throw new Error("Room name and type are required.");
  }

  if (roomType !== "public" && roomType !== "private") {
    throw new Error("Room type must be either 'public' or 'private'.");
  }

  try {
    // Check how many rooms the user has already created
    const scanParams = {
      TableName: ROOM_TABLE_NAME,
      FilterExpression: "#owner = :userId",
      ExpressionAttributeNames: {
        "#owner": "owner"
      },
      ExpressionAttributeValues: {
        ":userId": userId
      }
    };

    const scanResult = await docClient.send(new ScanCommand(scanParams));
    const userRoomCount = scanResult.Items ? scanResult.Items.length : 0;

    if (userRoomCount >= MAX_ROOMS_PER_USER) {
      throw new Error(`You can create a maximum of ${MAX_ROOMS_PER_USER} rooms. Please delete an existing room before creating a new one.`);
    }

    // Create the new room
    const roomId = randomUUID();
    const now = new Date().toISOString();

    const room = {
      id: roomId,
      name: name.trim(),
      roomType: roomType,
      members: [userId], // Creator is automatically a member
      owner: userId,
      createdAt: now,
      updatedAt: now,
      __typename: "Room"
    };

    const putParams = {
      TableName: ROOM_TABLE_NAME,
      Item: room
    };

    await docClient.send(new PutCommand(putParams));

    console.log(`Room created successfully: ${roomId}`);
    return room;

  } catch (error) {
    console.error("Error creating room:", error);
    throw new Error(error.message || "Failed to create room.");
  }
};
