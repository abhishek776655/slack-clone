import { gql } from "apollo-server";

const directMessage = gql`
  type DirectMessage {
    text: String
    id: Int!
    receiverId: Int!
    sender: User!
    createdAt: String!
    url: String
    filetype: String
  }

  type Query {
    directMessages(teamId: Int!, otherUserId: Int!): [DirectMessage]!
  }
  type Mutation {
    createDirectMessage(
      receiverId: Int!
      teamId: Int
      text: String
      url: String
      filetype: String
    ): Boolean!
  }
  type Subscription {
    newDirectMessage(teamId: Int!, userId: Int!): DirectMessage!
  }
`;

export default directMessage;
