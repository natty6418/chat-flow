import gql from 'graphql-tag';

export const mutations = {
  createMessage: gql`
  mutation CreateMessage($body: String!, $roomId: ID!) {
    createMessage(body: $body, roomId: $roomId) {
      id
      body
      from
      roomId
      createdAt
    }
  }
`,
  createRoom: gql`
    mutation CreateRoom($name: String!) {
      createRoom(name: $name) {
        id
        name
        createdAt
      }
    }
  `
};

export const queries = {
  listRooms: gql`
    query ListRooms {
      listRooms {
        id
        name
        createdAt
        owner
      }
    }
  `,
  getMessagesForRoom: gql`
    query GetMessagesForRoom($roomId: String!) {
      getMessagesForRoom(roomId: $roomId) {
        id
        body
        from
        roomId
        createdAt
      }
    }
  `
};

export const subscriptions = {
  onNewMessageInRoom: gql`
    subscription OnNewMessageInRoom($roomId: String!) {
      onNewMessageInRoom(roomId: $roomId) {
        id
        body
        from
        roomId
        createdAt
      }
    }
  `
};