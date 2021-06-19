import { ApolloServer, makeExecutableSchema } from "apollo-server";
import resolvers from "./resolvers";

import models from "./models";
import typeDefs from "./schema";
import { getUser } from "./auth";

const schema = makeExecutableSchema({ typeDefs, resolvers });
const SECRET = "rfdeskfpsgjkdjfglkdsj";
const SECRET2 = "rfdeskfdsadsadsadsadd";
const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    console.log(token);
    const user = getUser(token, SECRET);

    return { user, models, SECRET, SECRET2 };
  },
});

// The `listen` method launches a web server.
models.sequelize.sync().then(() => {
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
});
