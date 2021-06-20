import merge from "lodash/merge";
import userResolvers from "./user";
import teamResolvers from "./team";
import channelResolvers from "./channel";
import messageResolvers from "./message";
const resolvers = merge(
  userResolvers,
  teamResolvers,
  channelResolvers,
  messageResolvers
);

export default resolvers;
