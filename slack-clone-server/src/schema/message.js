import { gql } from "apollo-server";

const message = gql`
  scalar Date
  type Message {
    text: String
    id: Int!
    user: User!
    channel: Channel!
    url: String
    filetype: String
    createdAt: Date!
  }
  type Subscription {
    newChannelMessage(channelId: Int!): Message!
  }
  type Query {
    messages(channelId: Int!, cursor: Date): [Message]!
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
