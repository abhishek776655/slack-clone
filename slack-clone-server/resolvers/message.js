const { PubSub } = require('apollo-server');


const pubsub = new PubSub();

const NEW_CHANNEL_MESSAGE = "NEW_CHANNEL_MESSAGE"
export default {
  Subscription: {
    createMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
        (payload, args) => {
          // Only push an update if the comment is on
          // the correct repository for this operation
          return (payload.channelId === args.channelId);
        },
      )
    },
  },
  Query: {},
  Mutation: {},
};
