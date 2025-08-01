export default interface Message {
  id: string;
  body: string;
  owner: string; // Changed from 'from' to 'owner' to match GraphQL schema
  createdAt: string;
  roomId: string;
  roomMembers?: string[]; // Optional since it's in the schema
  updatedAt?: string; // Optional since it's in the schema
}