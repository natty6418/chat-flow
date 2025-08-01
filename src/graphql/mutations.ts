/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../services/api";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const joinRoom = /* GraphQL */ `mutation JoinRoom($roomId: ID!) {
  joinRoom(roomId: $roomId) {
    id
    name
    roomType
    members
    messages {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.JoinRoomMutationVariables,
  APITypes.JoinRoomMutation
>;
export const createMessage = /* GraphQL */ `mutation CreateMessage($body: String!, $roomId: ID!) {
  createMessage(body: $body, roomId: $roomId) {
    id
    body
    createdAt
    roomId
    roomMembers
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateMessageMutationVariables,
  APITypes.CreateMessageMutation
>;
export const createRoom = /* GraphQL */ `mutation CreateRoom(
  $input: CreateRoomInput!
  $condition: ModelRoomConditionInput
) {
  createRoom(input: $input, condition: $condition) {
    id
    name
    roomType
    members
    messages {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateRoomMutationVariables,
  APITypes.CreateRoomMutation
>;
export const updateRoom = /* GraphQL */ `mutation UpdateRoom(
  $input: UpdateRoomInput!
  $condition: ModelRoomConditionInput
) {
  updateRoom(input: $input, condition: $condition) {
    id
    name
    roomType
    members
    messages {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateRoomMutationVariables,
  APITypes.UpdateRoomMutation
>;
export const deleteRoom = /* GraphQL */ `mutation DeleteRoom(
  $input: DeleteRoomInput!
  $condition: ModelRoomConditionInput
) {
  deleteRoom(input: $input, condition: $condition) {
    id
    name
    roomType
    members
    messages {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteRoomMutationVariables,
  APITypes.DeleteRoomMutation
>;
