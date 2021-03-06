import requireAuth, { directMessageControlAction } from "../permission";
const { Op } = require("sequelize");
const { withFilter } = require("apollo-server");
import pubsub from "../pubsub";

const NEW_DIRECT_MESSAGE = "NEW_DIRECT_MESSAGE";
export default {
  Subscription: {
    newDirectMessage: {
      subscribe: directMessageControlAction.createResolver(
        withFilter(
          () => pubsub.asyncIterator(NEW_DIRECT_MESSAGE),
          (payload, args, { user }) => {
            console.log(payload);

            return (
              payload.teamId === args.teamId &&
              ((payload.newDirectMessage.senderId === user.user.id &&
                payload.newDirectMessage.receiverId === args.userId) ||
                (payload.newDirectMessage.receiverId === user.user.id &&
                  payload.newDirectMessage.senderId === args.userId))
            );
          }
        )
      ),
    },
  },
  Query: {
    directMessages: requireAuth.createResolver(
      async (parents, args, { models, user }, info) => {
        try {
          const options = {
            order: [["createdAt", "DESC"]],
            limit: 15,
            where: {
              teamId: args.teamId,
              [Op.or]: [
                {
                  [Op.and]: [
                    { receiverId: args.otherUserId },
                    { senderId: user.user.id },
                  ],
                },
                {
                  [Op.and]: [
                    { receiverId: user.user.id },
                    { senderId: args.otherUserId },
                  ],
                },
              ],
            },
          };

          if (args.cursor) {
            options.where.created_at = {
              [Op.lt]: args.cursor,
            };
          }
          const message = await models.DirectMessage.findAll(options);
          console.warn(message);
          return message;
        } catch (e) {
          console.log(e);
        }
      }
    ),
  },
  Mutation: {
    createDirectMessage: requireAuth.createResolver(
      async (parents, args, { models, user }, info) => {
        try {
          const messages = await models.DirectMessage.create({
            ...args,
            senderId: user.user.id,
          });

          pubsub.publish(NEW_DIRECT_MESSAGE, {
            teamId: args.teamId,
            newDirectMessage: {
              ...messages.dataValues,
              sender: { username: user.user.username },
            },
          });

          return true;
        } catch (e) {
          console.log(e);
          return false;
        }
      }
    ),
  },
  DirectMessage: {
    sender: ({ user, senderId }, args, { models }) => {
      if (user) {
        return user;
      }

      return models.User.findOne({ where: { id: senderId } }, { raw: true });
    },
  },
};
