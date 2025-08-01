/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../services/api";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateMessage = /* GraphQL */ `subscription OnCreateMessage {
  onCreateMessage {
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
` as GeneratedSubscription<
  APITypes.OnCreateMessageSubscriptionVariables,
  APITypes.OnCreateMessageSubscription
>;
export const onCreateRoom = /* GraphQL */ `subscription OnCreateRoom(
  $filter: ModelSubscriptionRoomFilterInput
  $owner: String
) {
  onCreateRoom(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateRoomSubscriptionVariables,
  APITypes.OnCreateRoomSubscription
>;
export const onUpdateRoom = /* GraphQL */ `subscription OnUpdateRoom(
  $filter: ModelSubscriptionRoomFilterInput
  $owner: String
) {
  onUpdateRoom(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateRoomSubscriptionVariables,
  APITypes.OnUpdateRoomSubscription
>;
export const onDeleteRoom = /* GraphQL */ `subscription OnDeleteRoom(
  $filter: ModelSubscriptionRoomFilterInput
  $owner: String
) {
  onDeleteRoom(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteRoomSubscriptionVariables,
  APITypes.OnDeleteRoomSubscription
>;
