import { gql } from "apollo-server";

const user = gql`
  type User {
    id: Int!
    email: String!
    username: String!
    teams: [Team!]!
  }

  type Query {
    me: User!
    getUser(userId: Int!): User
    allUsers: [User!]!
    allTeams: [Team!]!
    inviteTeams: [Team!]!
  }
  type RegisterResponse {
    ok: Boolean!
    user: User
    errors: [Error!]
  }
  type LoginResponse {
    ok: Boolean!
    token: String
    refreshToken: String
    errors: [Error!]
  }
  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
    ): RegisterResponse!
    login(email: String, password: String!): LoginResponse!
  }
`;
export default user;
