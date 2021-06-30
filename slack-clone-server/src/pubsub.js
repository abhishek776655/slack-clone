import { RedisPubSub } from "graphql-redis-subscriptions";

const pubsub = new RedisPubSub({
  connection: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: 6379,
    retry_strategy: (options) => {
      // reconnect after upto 3000 milis
      return Math.max(options.attempt * 100, 3000);
    },
  },
});
export default pubsub;
