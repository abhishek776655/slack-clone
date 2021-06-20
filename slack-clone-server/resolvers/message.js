const { PubSub } = require("apollo-server");
import requireAuth from "../permission";
const pubsub = new PubSub();

const NEW_CHANNEL_MESSAGE = "NEW_CHANNEL_MESSAGE";
export default {
  // Subscription: {
  //   createMessage: {
  //     subscribe: withFilter(
  //       () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
  //       (payload, args) => {
  //         // Only push an update if the comment is on
  //         // the correct repository for this operation
  //         return payload.channelId === args.channelId;
  //       }
  //     ),
  //   },
  // },
  Query: {
    messages: requireAuth.createResolver(
      async (parents, args, { models, user }, info) => {
        console.log(args.channelId);

        try {
          const message = await models.Message.findAll(
            {
              where: {
                channelId: args.channelId,
              },
            },
            { raw: true }
          );
          console.log(message);
          return message;
        } catch (e) {
          console.log(e);
        }
        // console.log(messages);
        // return messages;
      }
    ),
  },
  Mutation: {
    createMessage: requireAuth.createResolver(
      async (parents, args, { models, user }, info) => {
        console.log(args);
        try {
          const messages = await models.Message.create({
            ...args,
            userId: user.user.id,
          });
          console.log(messages);
          return true;
        } catch (e) {
          console.log(e);
          return false;
        }
      }
    ),
  },
  Message: {
    user: ({ userId }, args, { models }) =>
      models.User.findOne({ where: { id: userId } }, { raw: true }),
  },
};
