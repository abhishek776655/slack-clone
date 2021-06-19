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
          const team = await models.Team.findOne(
            { where: { id: args.teamId } },
            { raw: true }
          );
          console.log(team);
          if (team.owner !== user.user.id) {
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
          return {
            ok: true,
            channel,
          };
        } catch (e) {
          console.log(e);
          return {
            ok: false,
            errors: formatErrors(e),
          };
        }
      }
    ),
  },
};
