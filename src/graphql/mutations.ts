/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../services/api";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

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
