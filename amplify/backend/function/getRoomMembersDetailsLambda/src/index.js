/* Amplify Params - DO NOT EDIT
	AUTH_REALTIMECHAT3C34C86C_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT *//*
This is the Node.js code for your getRoomMembersDetailsLambda function.
File path: amplify/backend/function/getRoomMembersDetailsLambda/src/index.js

This function will:
1. Receive a roomId.
2. Fetch the Room from DynamoDB to get its 'members' and 'owner' lists.
3. For each unique user ID, it will look up the user in Cognito.
4. It will return a list of objects containing each user's ID and preferred_username.
*/

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { CognitoIdentityProviderClient, AdminGetUserCommand } = require("@aws-sdk/client-cognito-identity-provider");

// Initialize AWS SDK clients
const dbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dbClient);
const cognitoClient = new CognitoIdentityProviderClient({});

// Get table and user pool names from environment variables
const ROOM_TABLE_NAME = process.env.API_REALTIMECHAT_ROOMTABLE_NAME;
const USER_POOL_ID = process.env.AUTH_REALTIMECHAT3C34C86C_USERPOOLID;

/**
 * @type {import('@types/aws-lambda').AppSyncResolverHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const { roomId } = event.arguments;
  console.log(`Fetching room details for roomId: ${roomId}`);

  // --- Step 1: Fetch the Room from DynamoDB ---
  const getRoomParams = {
    TableName: ROOM_TABLE_NAME,
    Key: { id: roomId },
  };
  const getRoomCommand = new GetCommand(getRoomParams);
  const getRoomResponse = await docClient.send(getRoomCommand);
  const room = getRoomResponse.Item;

  console.log(`Room found:`, JSON.stringify(room, null, 2));

  if (!room) {
    throw new Error(`Room with ID ${roomId} not found.`);
  }

  // --- Step 2: Get a unique list of all user IDs associated with the room ---
  const memberIds = room.members || [];
  const ownerId = room.owner ? room.owner.split('::')[0] : null;
  console.log(`Member IDs from room.members:`, memberIds);
  console.log(`Owner ID from room.owner:`, ownerId);
  console.log(`Full room.owner value:`, room.owner);
  
  const allUserIds = [...new Set([...memberIds, ownerId].filter(Boolean))]; // Filter out null/undefined
  console.log(`All unique user IDs to fetch:`, allUserIds);

  if (allUserIds.length === 0) {
    console.log("No user IDs found, returning empty array");
    return []; // Return empty list if no members or owner
  }

  // --- Step 3: Fetch details for each user from Cognito ---
  console.log(`Fetching user details from Cognito for users:`, allUserIds);
  const userDetailsPromises = allUserIds.map(userId => {
    const params = {
      UserPoolId: USER_POOL_ID,
      Username: userId,
    };
    const command = new AdminGetUserCommand(params);
    return cognitoClient.send(command);
  });

  const results = await Promise.allSettled(userDetailsPromises);
  console.log(`Cognito lookup results:`, results.map((result, index) => ({
    userId: allUserIds[index],
    status: result.status,
    error: result.status === 'rejected' ? result.reason.message : null
  })));

  const userDetails = results
    .filter(result => result.status === 'fulfilled')
    .map(result => {
      const cognitoUser = result.value;
      const preferredUsernameAttr = cognitoUser.UserAttributes.find(
        attr => attr.Name === 'preferred_username'
      );
      return {
        userId: cognitoUser.Username,
        preferredUsername: preferredUsernameAttr ? preferredUsernameAttr.Value : null,
      };
    });
  
  console.log("Returning user details:", userDetails);
  return userDetails;
};
