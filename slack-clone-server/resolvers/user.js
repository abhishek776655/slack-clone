import bcrypt from "bcrypt";
import _ from "lodash";
import { AuthenticationError } from "apollo-server";
import { tryLogin } from "../auth";
const formatErrors = (e) => {
  return e.errors.map((x) => _.pick(x, ["path", "message"]));
};
export default {
  Query: {
    getUser: (parent, { id }, { models }) =>
      models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { user, models }) => {
      if (!user) {
        throw new AuthenticationError("you must be logged in");
      }
      return models.User.findAll();
    },
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
