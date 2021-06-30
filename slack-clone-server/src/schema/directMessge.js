import { gql } from "apollo-server";

const directMessage = gql`
  scalar Date
  type DirectMessage {
    text: String
    id: Int!
    receiverId: Int!
    sender: User!
    createdAt: Date!
    url: String
    filetype: String
  }

  type Query {
    directMessages(
      teamId: Int!
      otherUserId: Int!
      cursor: Date
    ): [DirectMessage]!
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
