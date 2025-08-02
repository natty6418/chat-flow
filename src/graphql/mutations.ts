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
    ttl
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateMessageMutationVariables,
  APITypes.CreateMessageMutation
>;
export const createRoom = /* GraphQL */ `mutation CreateRoom($name: String!, $roomType: String!) {
  createRoom(name: $name, roomType: $roomType) {
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
export const deleteRoom = /* GraphQL */ `mutation DeleteRoom($id: ID!) {
  deleteRoom(id: $id) {
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
