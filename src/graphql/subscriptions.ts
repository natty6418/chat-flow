import gql from 'graphql-tag';

export const onNewMessageInRoom = /* GraphQL */ gql`
  subscription OnNewMessageInRoom($roomId: ID!) {
    onNewMessageInRoom(roomId: $roomId) {
      id
      body
      from
      roomId
      createdAt
    }
  }
`;