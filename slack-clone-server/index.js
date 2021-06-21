import { ApolloServer, makeExecutableSchema } from "apollo-server";
import resolvers from "./resolvers";

import models from "./models";
import typeDefs from "./schema";
import { getUser } from "./auth";

const schema = makeExecutableSchema({ typeDefs, resolvers });
const SECRET = "rfdeskfpsgjkdjfglkdsj";
const SECRET2 = "rfdeskfdsadsadsadsadd";
const server = new ApolloServer({
  subscriptions: {
    path: "/subscriptions",
    onConnect: (connectionParams, webSocket) => {
      if (connectionParams.authToken) {
        const token = connectionParams.authToken;
        const user = getUser(token);
        if (user) {
          return user;
        }
        throw new Error("invalid token");
      }

      throw new Error("Missing auth token!");
    },
  },
  schema,
  context: ({ req, connection }) => {
    if (connection) {
      return connection.context;
    } else {
      const token = req.headers.authorization || "";
      console.log(req.headers);
      console.log("token");
      const user = getUser(token, SECRET);

      return { user, models, SECRET, SECRET2 };
    }
  },
});

// The `listen` method launches a web server.
models.sequelize.sync().then(() => {
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
});
