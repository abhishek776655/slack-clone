import user from "./user";
import team from "./team";
import channel from "./channel";
import message from "./message";
import error from "./error";
import directMessage from "./directMessge";
const { mergeTypeDefs } = require("@graphql-tools/merge");
const schema = mergeTypeDefs([
  user,
  team,
  channel,
  message,
  error,
  directMessage,
]);
export default schema;
