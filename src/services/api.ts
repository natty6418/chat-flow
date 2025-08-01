/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Room = {
  __typename: "Room",
  id: string,
  name: string,
  roomType: string,
  members?: Array< string | null > | null,
  messages?: ModelMessageConnection | null,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type ModelMessageConnection = {
  __typename: "ModelMessageConnection",
  items:  Array<Message | null >,
  nextToken?: string | null,
};

export type Message = {
  __typename: "Message",
  id: string,
  body: string,
  createdAt: string,
  roomId: string,
  roomMembers?: Array< string | null > | null,
  ttl?: number | null,
  updatedAt: string,
  owner?: string | null,
};

export type UserDetail = {
  __typename: "UserDetail",
  userId: string,
  preferredUsername?: string | null,
};

export type ModelRoomFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  roomType?: ModelStringInput | null,
  members?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelRoomFilterInput | null > | null,
  or?: Array< ModelRoomFilterInput | null > | null,
  not?: ModelRoomFilterInput | null,
  owner?: ModelStringInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelRoomConnection = {
  __typename: "ModelRoomConnection",
  items:  Array<Room | null >,
  nextToken?: string | null,
};

export type ModelMessageFilterInput = {
  id?: ModelIDInput | null,
  body?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  roomId?: ModelIDInput | null,
  roomMembers?: ModelStringInput | null,
  ttl?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMessageFilterInput | null > | null,
  or?: Array< ModelMessageFilterInput | null > | null,
  not?: ModelMessageFilterInput | null,
  owner?: ModelStringInput | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelStringKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type JoinRoomMutationVariables = {
  roomId: string,
};

export type JoinRoomMutation = {
  joinRoom?:  {
    __typename: "Room",
    id: string,
    name: string,
    roomType: string,
    members?: Array< string | null > | null,
    messages?:  {
      __typename: "ModelMessageConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateMessageMutationVariables = {
  body: string,
  roomId: string,
};

export type CreateMessageMutation = {
  createMessage?:  {
    __typename: "Message",
    id: string,
    body: string,
    createdAt: string,
    roomId: string,
    roomMembers?: Array< string | null > | null,
    ttl?: number | null,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateRoomMutationVariables = {
  name: string,
  roomType: string,
};

export type CreateRoomMutation = {
  createRoom?:  {
    __typename: "Room",
    id: string,
    name: string,
    roomType: string,
    members?: Array< string | null > | null,
    messages?:  {
      __typename: "ModelMessageConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteRoomMutationVariables = {
  id: string,
};

export type DeleteRoomMutation = {
  deleteRoom?:  {
    __typename: "Room",
    id: string,
    name: string,
    roomType: string,
    members?: Array< string | null > | null,
    messages?:  {
      __typename: "ModelMessageConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type GetRoomMembersDetailsQueryVariables = {
  roomId: string,
};

export type GetRoomMembersDetailsQuery = {
  getRoomMembersDetails?:  Array< {
    __typename: "UserDetail",
    userId: string,
    preferredUsername?: string | null,
  } | null > | null,
};

export type GetUserRoomCountQueryVariables = {
};

export type GetUserRoomCountQuery = {
  getUserRoomCount?: number | null,
};

export type GetRoomQueryVariables = {
  id: string,
};

export type GetRoomQuery = {
  getRoom?:  {
    __typename: "Room",
    id: string,
    name: string,
    roomType: string,
    members?: Array< string | null > | null,
    messages?:  {
      __typename: "ModelMessageConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListRoomsQueryVariables = {
  filter?: ModelRoomFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListRoomsQuery = {
  listRooms?:  {
    __typename: "ModelRoomConnection",
    items:  Array< {
      __typename: "Room",
      id: string,
      name: string,
      roomType: string,
      members?: Array< string | null > | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetMessageQueryVariables = {
  id: string,
};

export type GetMessageQuery = {
  getMessage?:  {
    __typename: "Message",
    id: string,
    body: string,
    createdAt: string,
    roomId: string,
    roomMembers?: Array< string | null > | null,
    ttl?: number | null,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListMessagesQueryVariables = {
  filter?: ModelMessageFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMessagesQuery = {
  listMessages?:  {
    __typename: "ModelMessageConnection",
    items:  Array< {
      __typename: "Message",
      id: string,
      body: string,
      createdAt: string,
      roomId: string,
      roomMembers?: Array< string | null > | null,
      ttl?: number | null,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MessagesByRoomIdAndCreatedAtQueryVariables = {
  roomId: string,
  createdAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMessageFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MessagesByRoomIdAndCreatedAtQuery = {
  messagesByRoomIdAndCreatedAt?:  {
    __typename: "ModelMessageConnection",
    items:  Array< {
      __typename: "Message",
      id: string,
      body: string,
      createdAt: string,
      roomId: string,
      roomMembers?: Array< string | null > | null,
      ttl?: number | null,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateMessageSubscriptionVariables = {
};

export type OnCreateMessageSubscription = {
  onCreateMessage?:  {
    __typename: "Message",
    id: string,
    body: string,
    createdAt: string,
    roomId: string,
    roomMembers?: Array< string | null > | null,
    ttl?: number | null,
    updatedAt: string,
    owner?: string | null,
  } | null,
};
