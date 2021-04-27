import { ApolloServer, makeExecutableSchema } from "apollo-server";
import resolvers from "./resolvers";

import models from "./models";
import typeDefs from "./schema";

const schema = makeExecutableSchema({ typeDefs, resolvers });
const server = new ApolloServer({
  schema,
  context: {
    models,
    user: 1,
  },
});

// The `listen` method launches a web server.
models.sequelize.sync().then(() => {
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
});
