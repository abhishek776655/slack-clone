import { gql } from "apollo-server";

const message = gql`
  type Message {
    text: String
    id: Int!
    user: User!
    channel: Channel!
    url: String
    filetype: String
    createdAt: String!
  }
  type Subscription {
    newChannelMessage(channelId: Int!): Message!
  }
  type Query {
    messages(channelId: Int!): [Message]!
  }
  type Mutation {
    createMessage(
      channelId: Int!
      text: String
      url: String
      filetype: String
    ): Boolean!
  }
`;

export default message;
