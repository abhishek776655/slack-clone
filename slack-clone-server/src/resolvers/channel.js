import requiresAuth from "../permission";

const formatErrors = (e) => {
  return e.errors.map((x) => _.pick(x, ["path", "message"]));
};
export default {
  Mutation: {
    createChannel: requiresAuth.createResolver(
      async (parent, args, { models, user }) => {
        try {
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
          console.log(args);
          // const response = models.sequelize.transaction(async (transaction) => {
          const channel = await models.Channel.create(args);
          if (!args.public) {
            const members = args.members.filter((m) => m !== user.user.id);
            members.push(user.user.id);
            console.log(members);
            const argument = members.map((m) => ({
              userId: m,
              channelId: channel.dataValues.id,
            }));
            const member = models.PCMember.bulkCreate(argument);
          }
          // return channel;
          //  });

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
