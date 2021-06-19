import merge from "lodash/merge";
import userResolvers from "./user";
import teamResolvers from "./team";
import channelResolvers from "./channel";
const resolvers = merge(userResolvers, teamResolvers, channelResolvers);

export default resolvers;
