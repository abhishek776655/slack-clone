import user from "./user";
import team from "./team";
import channel from "./channel";
import message from "./message";
import error from "./error";
const { mergeTypeDefs } = require("@graphql-tools/merge");
const schema = mergeTypeDefs([user, team, channel, message, error]);
export default schema;
