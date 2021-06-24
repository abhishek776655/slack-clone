import merge from "lodash/merge";
import userResolvers from "./user";
import teamResolvers from "./team";
import channelResolvers from "./channel";
import directMessageResolvers from "./directMessage";
import messageResolvers from "./message";
const resolvers = merge(
  userResolvers,
  teamResolvers,
  channelResolvers,
  messageResolvers,
  directMessageResolvers
);

export default resolvers;
