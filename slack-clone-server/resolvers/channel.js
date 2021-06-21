import { UserInputError } from "apollo-server-errors";
import requiresAuth from "../permission";

const formatErrors = (e) => {
  return e.errors.map((x) => _.pick(x, ["path", "message"]));
};
export default {
  Mutation: {
    createChannel: requiresAuth.createResolver(
      async (parent, args, { models, user }) => {
        try {
          console.log(args);
          const member = await models.Member.findOne(
            { where: { teamId: args.teamId, userId: user.user.id } },
            { raw: true }
          );

          if (!member.admin) {
            return {
              ok: false,
              errors: [
                {
                  path: "name",
                  message: "You have to be owner to team to create channel",
                },
              ],
            };
          }
          const channel = await models.Channel.create(args);
          console.log(channel);
          console.log("true");
          return {
            ok: true,
            channel,
          };
        } catch (e) {
          console.log(e);
          console.log("false");
          return {
            ok: false,
            errors: formatErrors(e),
          };
        }
      }
    ),
  },
};
