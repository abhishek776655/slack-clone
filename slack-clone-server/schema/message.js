import { gql } from "apollo-server";

const message = gql`
  type Message {
    text: String!
    id: Int!
    user: User!
    channel: Channel!
    createdAt: String!
  }
  type Subscription {
    newChannelMessage(channelId: Int!): Message!
  }

  type Query {
    messages(channelId: Int!): [Message]!
  }
  type Mutation {
    createMessage(channelId: Int!, text: String!): Boolean!
  }
`;

export default message;
