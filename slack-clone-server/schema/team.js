import { gql } from "apollo-server";

const team = gql`
  type Team {
    id: Int!
    owner: Int!
    name: String!
    members: [User!]!
    channels: [Channel!]!
  }
  type CreateTeamResponse {
    ok: Boolean!
    team: Team
    errors: [Error!]
  }

  type Query {
    allTeams: [Team!]!
    inviteTeams: [Team!]!
  }
  type VoidResponse {
    ok: Boolean!
    errors: [Error!]
  }
  type Mutation {
    createTeam(name: String!): CreateTeamResponse!
    inviteMember(email: String!, teamId: Int!): VoidResponse!
  }
`;
export default team;
