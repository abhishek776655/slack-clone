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
        console.log("subscriptionToken", token);
        const user = getUser(token);

        if (user) {
          console.log("user", user);
          return { user, models };
        }
        return { models };
      }

      return { models };
    },
  },
  schema,
  context: ({ req, connection }) => {
    if (connection) {
      console.log("connection", connection.context);
      return connection.context;
    } else {
      const token = req.headers.authorization || "";

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
