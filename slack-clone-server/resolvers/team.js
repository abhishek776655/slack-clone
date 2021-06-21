import requiresAuth from "../permission";
import _ from "lodash";
const formatErrors = (e) => {
  return e.errors.map((x) => _.pick(x, ["path", "message"]));
};

export default {
  Mutation: {
    createTeam: requiresAuth.createResolver(
      async (parent, args, { models, user }) => {
        try {
          const Response = await models.sequelize.transaction(async () => {
            const team = await models.Team.create({
              ...args,
            });
            console.log(team);
            await models.Channel.create({
              name: "general",
              public: true,
              teamId: team.dataValues.id,
            });

            const member = await models.Member.create({
              teamId: team.id,
              userId: user.user.id,
              admin: true,
            });
            console.log("member", member);
            return team;
          });

          return {
            ok: true,
            team: Response,
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
    inviteMember: requiresAuth.createResolver(
      async (parent, { email, teamId }, { models, user }) => {
        try {
          const userToAddPromise = models.User.findOne(
            { where: { email: email } },
            { raw: true }
          );
          const memberPromise = models.Member.findOne(
            { where: { team_id: teamId, userId: user.user.id } },
            { raw: true }
          );

          const [userToAdd, member] = await Promise.all([
            userToAddPromise,
            memberPromise,
          ]);
          if (!member.admin) {
            console.log(team);
            console.log(userToAdd);

            return {
              ok: false,
              errors: [
                { path: "email", message: "You cannot add to member to team" },
              ],
            };
          }
          if (!userToAdd) {
            return {
              ok: false,
              errors: [{ path: "email", message: "Invalid email" }],
            };
          }
          const memberCreate = await models.Member.create({
            userId: userToAdd.id,
            teamId: teamId,
          });
          return {
            ok: true,
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
  Team: {
    channels: ({ id }, args, { models }) =>
      models.Channel.findAll({ where: { teamId: id } }),
  },
};
