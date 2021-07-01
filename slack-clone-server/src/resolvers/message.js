const { withFilter, PubSub } = require("apollo-server");
import requireAuth, { requireControlAction } from "../permission";
//import pubsub from "../pubsub";
const { Op } = require("sequelize");
const pubsub = new PubSub();

const NEW_CHANNEL_MESSAGE = "NEW_CHANNEL_MESSAGE";
export default {
  Subscription: {
    newChannelMessage: {
      subscribe: requireControlAction.createResolver(
        withFilter(
          () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
          (payload, args) => {
            // Only push an update if the comment is on
            // the correct repository for this operation
            return payload.channelId === args.channelId;
          }
        )
      ),
    },
  },
  Query: {
    messages: requireAuth.createResolver(
      async (parents, args, { models, user }, info) => {
        const channel = await models.Channel.findOne(
          {
            where: {
              id: args.channelId,
            },
          },
          { raw: true }
        );
        if (!channel.public) {
          const membership = await models.PCMember.findOne({
            where: {
              channelId: args.channelId,
              userId: user.user.id,
            },
          });
          if (!membership) {
            throw new Error("Unauthorized");
          }
        }
        console.log(args);
        try {
          const options = {
            order: [["createdAt", "DESC"]],
            where: {
              channelId: args.channelId,
            },
            limit: 15,
          };
          if (args.cursor) {
            console.log("cursor", args.cursor);
            options.where.created_at = {
              [Op.lt]: args.cursor,
            };
          }

          const message = await models.Message.findAll(options, { raw: true });
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
          const asyncFunc = async () => {
            const currentUser = await models.User.findOne({
              where: {
                id: user.user.id,
              },
            });
            pubsub.publish(NEW_CHANNEL_MESSAGE, {
              channelId: args.channelId,
              newChannelMessage: {
                ...messages.dataValues,
                user: currentUser.dataValues,
              },
            });
          };
          asyncFunc();

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
    user: ({ user, userId }, args, { models }) => {
      if (user) {
        return user;
      }

      return models.User.findOne({ where: { id: userId } }, { raw: true });
    },
  },
};
