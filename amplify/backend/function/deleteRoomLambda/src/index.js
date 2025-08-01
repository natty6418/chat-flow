/* Amplify Params - DO NOT EDIT
	API_REALTIMECHAT_GRAPHQLAPIIDOUTPUT
	API_REALTIMECHAT_ROOMTABLE_ARN
	API_REALTIMECHAT_ROOMTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */


/*
This is the Node.js code for your deleteRoomLambda function.
File path: amplify/backend/function/deleteRoomLambda/src/index.js

This function will:
1. Receive a room ID and the user's identity.
2. Fetch the Room from DynamoDB.
3. Correctly parse the composite 'owner' field.
4. Verify the user making the request is the true owner.
5. If they are, it deletes the item from the DynamoDB table.
*/

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

// Initialize AWS SDK clients
const dbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dbClient);

// Get table name from environment variables
const ROOM_TABLE_NAME = process.env.API_REALTIMECHAT_ROOMTABLE_NAME;

/**
 * @type {import('@types/aws-lambda').AppSyncResolverHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const { id: roomId } = event.arguments;
  const userId = event.identity.sub;

  if (!userId) {
    throw new Error("User not authenticated.");
  }

  // --- Step 1: Fetch the Room from DynamoDB to verify ownership ---
  const getRoomParams = {
    TableName: ROOM_TABLE_NAME,
    Key: { id: roomId },
  };
  const getRoomCommand = new GetCommand(getRoomParams);
  const getRoomResponse = await docClient.send(getRoomCommand);
  const room = getRoomResponse.Item;

  if (!room) {
    // It's good practice to not reveal if a room exists or not.
    // We can return the room object as if it was deleted.
    console.log(`Room with ID ${roomId} not found. Returning success to obscure existence.`);
    return { id: roomId };
  }

  // --- Step 2: Correctly parse the owner ID and authorize ---
  const roomOwnerId = room.owner.split('::')[0];

  if (userId.trim() !== roomOwnerId.trim()) {
    throw new Error("Not Authorized: You are not the owner of this room.");
  }

  // --- Step 3: Delete the item from DynamoDB ---
  const deleteRoomParams = {
    TableName: ROOM_TABLE_NAME,
    Key: { id: roomId },
    ReturnValues: "ALL_OLD", // Return the item that was deleted
  };
  const deleteRoomCommand = new DeleteCommand(deleteRoomParams);
  const deleteResult = await docClient.send(deleteRoomCommand);

  console.log(`Successfully deleted room ${roomId}`);
  
  // Return the deleted item's attributes, which AppSync expects.
  return deleteResult.Attributes;
};
