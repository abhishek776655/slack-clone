import { gql } from "apollo-server";

const message = gql`
  type Message {
    text: String!
    id: Int!
    user: User!
    channel: Channel!
  }
  type Mutation {
    createMessage(channelId: Int!, text: String!): Boolean!
  }
`;

export default message;
