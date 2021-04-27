import { gql } from "apollo-server";

const team = gql`
  type Team {
    owner: User!
    members: [User!]!
    channels: [Channel!]!
  }
  type Mutation {
    createTeam(name: String!): Boolean!
  }
`;
export default team;
