import bcrypt from "bcrypt";
import _ from "lodash";
import requiresAuth from "../permission";
import { AuthenticationError } from "apollo-server";
import { tryLogin } from "../auth";
const formatErrors = (e) => {
  return e.errors.map((x) => _.pick(x, ["path", "message"]));
};
export default {
  User: {
    teams: (parent, args, { models, user }) =>
      models.sequelize.query(
        "select * from teams as team join members as member on team.id = member.team_id where member.user_id = ?",
        {
          replacements: [user.user.id],
          model: models.Team,
          raw: true,
        }
      ),
  },
  Query: {
    getUser: (parent, args, { user, models }) => {
      if (!user) {
        throw new AuthenticationError("you must be logged in");
      }
      return models.User.findOne({ where: { id: args.userId } });
    },
    me: requiresAuth.createResolver(async (parent, args, { models, user }) =>
      models.User.findOne({ where: { id: user.user.id } })
    ),
    allUsers: (parent, args, { user, models }) => {
      if (!user) {
        throw new AuthenticationError("you must be logged in");
      }
      return models.User.findAll();
    },
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
                user_id: user.user.id,
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
    login: (parent, { email, password }, { models, SECRET, SECRET2 }) =>
      tryLogin(email, password, models, SECRET, SECRET2),
    register: async (parent, { password, ...otherArgs }, { models }) => {
      try {
        if (password.length < 5) {
          return {
            ok: false,
            errors: [
              {
                path: "password",
                message:
                  "The password needs to be between 5 and 25 characters long",
              },
            ],
          };
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await models.User.create({
          ...otherArgs,
          password: hashedPassword,
        });
        return {
          ok: true,
          user,
        };
      } catch (e) {
        console.log(e);
        return {
          ok: false,
          errors: formatErrors(e),
        };
      }
    },
  },
};
