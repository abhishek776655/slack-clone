import user from "./user";
import team from "./team";
import channel from "./channel";
import message from "./message";
const { mergeTypeDefs } = require("@graphql-tools/merge");
const schema = mergeTypeDefs([user, team, channel, message]);
export default schema;
