/*
This is the Node.js code for your createMessageLambda function.
File path: amplify/backend/function/createMessageLambda/src/index.js

This version includes more robust logic to correctly handle the room's owner.
*/

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { randomUUID } = require("crypto"); // To generate a unique ID for the new message

// Initialize the DynamoDB Document Client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Get table names from environment variables provided by Amplify
const ROOM_TABLE_NAME = process.env.API_REALTIMECHAT_ROOMTABLE_NAME;
const MESSAGE_TABLE_NAME = process.env.API_REALTIMECHAT_MESSAGETABLE_NAME;

/**
 * @type {import('@types/aws-lambda').AppSyncResolverHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const { roomId, body } = event.arguments;
  const senderId = event.identity.sub; // The ID of the user creating the message

  if (!senderId) {
    throw new Error("User not authenticated.");
  }

  // --- Step 1: Fetch the Room to get its members list and owner ---
  const getRoomParams = {
    TableName: ROOM_TABLE_NAME,
    Key: { id: roomId },
  };
  const getRoomCommand = new GetCommand(getRoomParams);
  const getRoomResponse = await docClient.send(getRoomCommand);
  const room = getRoomResponse.Item;

  if (!room) {
    throw new Error(`Room with ID ${roomId} not found.`);
  }

  // --- Step 2: Ensure the user is the owner OR a member of the room ---
  const members = room.members || [];
  const roomOwnerId = room.owner.split('::')[0]; // Get the owner of the room

  // The sender must be the room's owner or be in the members list.
  if (senderId !== roomOwnerId && !members.includes(senderId)) {
    throw new Error(`You cannot send messages to this room. Reason: You are not the owner (${roomOwnerId}) and your user ID (${senderId}) is not in the members list (${JSON.stringify(members)}). Please join the room before sending messages.`);
  }

  // --- Step 3: Create the new Message object ---
  const messageId = randomUUID();
  const timestamp = new Date().toISOString();

  // Create a definitive list of who can read this message.
  // It includes all members plus the owner. A Set is used to avoid duplicates.
  const readers = [...new Set([...members, roomOwnerId])];

  const newMessage = {
    id: messageId,
    roomId: roomId,
    body: body,
    owner: senderId, // The owner of the MESSAGE is the person who sent it
    createdAt: timestamp,
    updatedAt: timestamp,
    // This is the crucial step: stamp the message with the definitive list of readers
    roomMembers: readers,
    __typename: "Message",
  };

  // --- Step 4: Save the new message to the Message table ---
  const putMessageParams = {
    TableName: MESSAGE_TABLE_NAME,
    Item: newMessage,
  };
  const putMessageCommand = new PutCommand(putMessageParams);
  await docClient.send(putMessageCommand);

  // --- Step 5: Return the newly created message ---
  return newMessage;
};