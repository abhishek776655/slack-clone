import Sequelize from "sequelize";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async () => {
  let maxReconnects = 20;
  let connected = false;
  const sequelize = new Sequelize("slack", "postgres", "getlost", {
    dialect: "postgres",
    host: process.env.DB_HOST || "localhost",
  });
  while (!connected && maxReconnects) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await sequelize.authenticate();
      connected = true;
    } catch (err) {
      console.log("reconnecting in 5 seconds");
      // eslint-disable-next-line no-await-in-loop
      await sleep(5000);
      maxReconnects -= 1;
    }
  }

  if (!connected) {
    return null;
  }

  const models = {
    User: require("./user").default(sequelize, Sequelize.DataTypes),
    Message: require("./message").default(sequelize, Sequelize.DataTypes),
    Channel: require("./channel").default(sequelize, Sequelize.DataTypes),
    Team: require("./team").default(sequelize, Sequelize.DataTypes),
    Member: require("./member").default(sequelize, Sequelize.DataTypes),
    DirectMessage: require("./directMessage").default(
      sequelize,
      Sequelize.DataTypes
    ),
    PCMember: require("./privateChannelMembers").default(
      sequelize,
      Sequelize.DataTypes
    ),
  };

  Object.keys(models).forEach((modelName) => {
    if ("associate" in models[modelName]) {
      models[modelName].associate(models);
    }
  });

  models.sequelize = sequelize;
  return models;
};
