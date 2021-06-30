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
          const Response = await models.sequelize.transaction(
            async (transaction) => {
              const team = await models.Team.create(
                {
                  ...args,
                },
                { transaction }
              );
              console.log(team);
              await models.Channel.create(
                {
                  name: "general",
                  public: true,
                  teamId: team.dataValues.id,
                },
                { transaction }
              );

              const member = await models.Member.create(
                {
                  teamId: team.id,
                  userId: user.user.id,
                  admin: true,
                },
                { transaction }
              );
              console.log("member", member);
              return team;
            }
          );

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
            user: userToAdd,
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

  Query: {
    getTeamMembers: requiresAuth.createResolver(
      async (parent, args, { models, user }) => {
        const users = await models.sequelize.query(
          "select * from users as u join members as m on m.user_id = u.id where m.team_id = ?",
          {
            replacements: [args.teamId],
            model: models.User,
            raw: true,
          }
        );
        console.warn(users);
        return users;
      }
    ),
  },
  Team: {
    channels: async ({ id }, args, { channelLoader }) => {
      console.log(channelLoader.load);
      return channelLoader.load(id);
    },
    directMessageMembers: async ({ id }, args, { models, user }) => {
      const users = await models.sequelize.query(
        "select distinct on (u.id) u.id ,u.username from users as u join direct_messages as dm on (u.id=dm.sender_id) or (u.id=dm.receiver_id) where (:currentUserId=dm.sender_id or :currentUserId=dm.receiver_id) and (dm.team_id=:currentTeamId) ",
        {
          replacements: { currentUserId: user.user.id, currentTeamId: id },
          model: models.User,
          raw: true,
        }
      );

      return users;
    },
  },
};
