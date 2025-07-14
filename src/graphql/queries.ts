import gql from 'graphql-tag';

export const getMessagesForRoom = /* GraphQL */ gql`
  query GetMessagesForRoom($roomId: ID!) {
    getMessagesForRoom(roomId: $roomId) {
      id
      body
      from
      roomId
      createdAt
    }
  }
`;

export const listRooms = /* GraphQL */ gql`
  query ListRooms {
    listRooms {
      id
      name
      createdAt
    }
  }
`; 