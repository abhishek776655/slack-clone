import { ApolloServer, makeExecutableSchema } from "apollo-server";
import resolvers from "./resolvers";
import getModels from "./models";
import typeDefs from "./schema";
const DataLoader = require("dataloader");
import { getUser } from "./auth";

import channelBatcher from "./batchFunction";

const schema = makeExecutableSchema({ typeDefs, resolvers });
const SECRET = "rfdeskfpsgjkdjfglkdsj";
const SECRET2 = "rfdeskfdsadsadsadsadd";

getModels().then((models) => {
  if (!models) {
    console.log("Could not connect to database");
    return;
  }

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

        return {
          user,
          models,
          SECRET,
          SECRET2,
          channelLoader: new DataLoader((ids) =>
            channelBatcher(ids, models, user)
          ),
        };
      }
    },
  });

  var server_host = "" || "0.0.0.0";
  // The `listen` method launches a web server.
  models.sequelize.sync().then(() => {
    server.listen(process.env.PORT || 4000).then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  });
});
