import { gql } from "apollo-server";

const team = gql`
  type Team {
    id: Int!
    name: String!
    members: [User!]!
    directMessageMembers: [User!]!
    channels: [Channel!]!
    admin: Boolean!
  }
  type CreateTeamResponse {
    ok: Boolean!
    team: Team
    errors: [Error!]
  }
  type Query {
    getTeamMembers(teamId: Int!): [User!]!
  }

  type VoidResponse {
    ok: Boolean!
    errors: [Error!]
    user: User
  }
  type Mutation {
    createTeam(name: String!): CreateTeamResponse!
    inviteMember(email: String!, teamId: Int!): VoidResponse!
  }
`;
export default team;
