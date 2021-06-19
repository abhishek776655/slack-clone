import jwt from "jsonwebtoken";
import _ from "lodash";
import bcrypt from "bcrypt";

export const createTokens = async (user, secret, secret2) => {
  const createToken = jwt.sign(
    {
      user: _.pick(user, ["id", "username"]),
    },
    secret,
    {
      expiresIn: "1h",
    }
  );

  const createRefreshToken = jwt.sign(
    {
      user: _.pick(user, "id"),
    },
    secret2,
    {
      expiresIn: "7d",
    }
  );

  return [createToken, createRefreshToken];
};

export const refreshTokens = async (token, refreshToken, models, SECRET2) => {
  let userId = -1;
  try {
    const {
      user: { id },
    } = jwt.decode(refreshToken);
    userId = id;
  } catch (err) {
    return {};
  }

  if (!userId) {
    return {};
  }

  const user = await models.User.findOne({ where: { id: userId }, raw: true });

  if (!user) {
    return {};
  }

  try {
    jwt.verify(refreshToken, SECRET2);
  } catch (err) {
    return {};
  }

  const [newToken, newRefreshToken] = await createTokens(
    user,
    SECRET,
    user.refreshSecret
  );
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user,
  };
};

export const tryLogin = async (email, password, models, SECRET, SECRET2) => {
  const user = await models.User.findOne({ where: { email }, raw: true });
  if (!user) {
    // user with provided email not found
    return {
      ok: false,
      errors: [{ path: "email", message: "No user with this email exists" }],
    };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    // bad password
    return {
      ok: false,
      errors: [{ path: "password", message: "Wrong password" }],
    };
  }
  const refreshSecret = user.password + SECRET2;
  const [token, refreshToken] = await createTokens(user, SECRET, refreshSecret);

  return {
    ok: true,
    token,
    refreshToken,
  };
};

export const getUser = (token, SECRET) => {
  console.log("token", token);
  let user = null;
  if (token) {
    user = jwt.decode(token, SECRET);
    if (user) {
      jwt.verify(token, SECRET, function (err, decoded) {
        if (err) {
          return null;
        }
        return decoded;
      });
    } else {
      return null;
    }
  }

  return user;
};
