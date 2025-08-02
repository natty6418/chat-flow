/* Amplify Params - DO NOT EDIT
	API_REALTIMECHAT_GRAPHQLAPIIDOUTPUT
	API_REALTIMECHAT_ROOMTABLE_ARN
	API_REALTIMECHAT_ROOMTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");


const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);


const ROOM_TABLE = process.env.API_REALTIMECHAT_ROOMTABLE_NAME;

exports.handler = async (event) => {
    console.log("Event:", event);

    const { roomId } = event.arguments;
    const userId = event.identity.sub;

    

    // 1. Fetch the room
    const roomResult = await docClient.send(
        new GetCommand({
            TableName: ROOM_TABLE,
            Key: { id: roomId },
        })
    );

    if (!roomResult.Item) {
        throw new Error("Room not found");
    }

    const room = roomResult.Item;

    // 2. Check if user is already a member
    if (room.members && room.members.includes(userId)) {
        return room;
    }

    // 3. Add user to members
    const updatedMembers = room.members ? [...room.members, userId] : [userId];

    await docClient.send(
        new UpdateCommand({
            TableName: ROOM_TABLE,
            Key: { id: roomId },
            UpdateExpression: "SET members = :members",
            ExpressionAttributeValues: {
                ":members": updatedMembers,
            },
            ReturnValues: "ALL_NEW",
        })
    );

    return { ...room, members: updatedMembers };
};
