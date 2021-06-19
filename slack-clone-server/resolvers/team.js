import requiresAuth from "../permission";
import _ from "lodash";
const formatErrors = (e) => {
  return e.errors.map((x) => _.pick(x, ["path", "message"]));
};

export default {
  Query: {
    allTeams: requiresAuth.createResolver(
      async (parent, args, { models, user }) => {
        const userResponse = await models.Team.findAll(
          { where: { owner: user.user.id } },
          { raw: true }
        );

        return userResponse;
      }
    ),
    inviteTeams: requiresAuth.createResolver(
      async (parent, args, { models, user }) => {
        const userResponse = await models.Team.findAll({
          include: [
            {
              model: models.User,
              where: {
                id: user.user.id,
              },
              paranoid: false,
            },
          ],
        });
        return userResponse;
      }
    ),
  },
  Mutation: {
    createTeam: requiresAuth.createResolver(
      async (parent, args, { models, user }) => {
        try {
          const Response = await models.sequelize.transaction(async () => {
            const team = await models.Team.create({
              name: args.name,
              owner: user.user.id,
            });
            await models.Channel.create({
              name: "general",
              public: true,
              teamId: team.id,
            });
            return team;
          });
          console.log(user.user.id);

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
          const teamPromise = models.Team.findOne(
            { where: { id: teamId } },
            { raw: true }
          );

          const [userToAdd, team] = await Promise.all([
            userToAddPromise,
            teamPromise,
          ]);
          if (team.owner !== user.user.id) {
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
          const member = await models.Member.create({
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
