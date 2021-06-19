import { gql } from "apollo-server";

const message = gql`
  type Message {
    text: String!
    id: Int!
    user: User!
    channel: Channel!
  }
  type Subscription {
    newChannelMessage(channelId: Int!): Message!
  }
  type Mutation {
    createMessage(channelId: Int!, text: String!): Boolean!
  }
`;

export default message;
