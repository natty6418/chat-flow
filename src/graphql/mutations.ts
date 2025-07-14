import gql from 'graphql-tag';

export const createMessage = /* GraphQL */ gql`
  mutation CreateMessage($body: String!, $roomId: ID!) {
    createMessage(body: $body, roomId: $roomId) {
      id
      body
      from
      roomId
      createdAt
    }
  }
`;

export const createRoom = /* GraphQL */ gql`
  mutation CreateRoom($name: String!) {
    createRoom(name: $name) {
      id
      name
      createdAt
    }
  }
`;