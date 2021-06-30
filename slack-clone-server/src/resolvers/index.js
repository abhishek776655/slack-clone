import merge from "lodash/merge";
import userResolvers from "./user";
import teamResolvers from "./team";
import channelResolvers from "./channel";
import directMessageResolvers from "./directMessage";
import messageResolvers from "./message";
import dateResolver from "./date.js";
const resolvers = merge(
  userResolvers,
  teamResolvers,
  channelResolvers,
  messageResolvers,
  directMessageResolvers,
  dateResolver
);

export default resolvers;
