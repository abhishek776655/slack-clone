const { Op } = require("sequelize");

const createResolver = (resolver) => {
  const baseResolver = resolver;
  baseResolver.createResolver = (childResolver) => {
    const newResolver = async (parent, args, context, info) => {
      await resolver(parent, args, context, info);
      return childResolver(parent, args, context, info);
    };
    return createResolver(newResolver);
  };
  return baseResolver;
};

// requiresAuth
export default createResolver((parent, args, { user }) => {
  console.log(user);
  if (!user) {
    console.log(user);
    throw new Error("Not authenticated");
  }
});
const requireControlAction = createResolver(
  async (parent, args, { user, models }) => {
    if (!user || !user.user.id) {
      throw new Error("Not authenticated");
    }
    const channel = await models.Channel.findOne({
      where: {
        id: args.channelId,
      },
    });
    const member = await models.Member.findOne({
      where: {
        teamId: channel.teamId,
        userId: user.user.id,
      },
    });
    if (!member) {
      console.log("badsadsa");
      throw new Error("Not a member of current team");
    }
  }
);
const directMessageControlAction = createResolver(
  async (parent, args, { user, models }) => {
    if (!user || !user.user.id) {
      throw new Error("Not authenticated");
    }
    const member = await models.Member.findOne({
      where: {
        teamId: args.teamId,
        [Op.or]: [{ userId: args.userId }, { userId: user.user.id }],
      },
    });
    if (!member) {
      throw new Error("Not a member of current team");
    }
  }
);

export { requireControlAction, directMessageControlAction };
