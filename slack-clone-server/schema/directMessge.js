import { gql } from "apollo-server";

const directMessage = gql`
  type DirectMessage {
    text: String!
    id: Int!
    receiverId: Int!
    sender: User!
    createdAt: String!
  }

  type Query {
    directMessages(teamId: Int!, otherUserId: Int!): [DirectMessage]!
  }
  type Mutation {
    createDirectMessage(receiverId: Int!, text: String!, teamId: Int!): Boolean!
  }
  type Subscription {
    newDirectMessage(teamId: Int!, userId: Int!): DirectMessage!
  }
`;

export default directMessage;
