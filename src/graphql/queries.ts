/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../services/api";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getRoomMembersDetails = /* GraphQL */ `query GetRoomMembersDetails($roomId: ID!) {
  getRoomMembersDetails(roomId: $roomId) {
    userId
    preferredUsername
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetRoomMembersDetailsQueryVariables,
  APITypes.GetRoomMembersDetailsQuery
>;
export const getUserRoomCount = /* GraphQL */ `query GetUserRoomCount {
  getUserRoomCount
}
` as GeneratedQuery<
  APITypes.GetUserRoomCountQueryVariables,
  APITypes.GetUserRoomCountQuery
>;
export const getRoom = /* GraphQL */ `query GetRoom($id: ID!) {
  getRoom(id: $id) {
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
` as GeneratedQuery<APITypes.GetRoomQueryVariables, APITypes.GetRoomQuery>;
export const listRooms = /* GraphQL */ `query ListRooms(
  $filter: ModelRoomFilterInput
  $limit: Int
  $nextToken: String
) {
  listRooms(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      roomType
      members
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListRoomsQueryVariables, APITypes.ListRoomsQuery>;
export const getMessage = /* GraphQL */ `query GetMessage($id: ID!) {
  getMessage(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetMessageQueryVariables,
  APITypes.GetMessageQuery
>;
export const listMessages = /* GraphQL */ `query ListMessages(
  $filter: ModelMessageFilterInput
  $limit: Int
  $nextToken: String
) {
  listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMessagesQueryVariables,
  APITypes.ListMessagesQuery
>;
export const messagesByRoomIdAndCreatedAt = /* GraphQL */ `query MessagesByRoomIdAndCreatedAt(
  $roomId: ID!
  $createdAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelMessageFilterInput
  $limit: Int
  $nextToken: String
) {
  messagesByRoomIdAndCreatedAt(
    roomId: $roomId
    createdAt: $createdAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MessagesByRoomIdAndCreatedAtQueryVariables,
  APITypes.MessagesByRoomIdAndCreatedAtQuery
>;
