import Sequelize from "sequelize";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
require("dotenv").config({ path: `./.env.${process.env.NODE_ENV}` });
console.log(process.env);
export default async () => {
  let maxReconnects = 20;
  let connected = false;
  console.log("env", process.env.NODE_ENV);
  console.log("url", process.env.DATABASE_URL);
  let sequelize;
  if (process.env.NODE_ENV === "development") {
    console.log("development");
    console.log(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD
    );
    sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        dialect: "postgres",
        host: process.env.DB_HOST,
      }
    );
  } else {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      dialectOptions: {
        ssl: {
          require: true, // This will help you. But you will see nwe error
          rejectUnauthorized: false, // This line will fix new error
        },
      },
    });
  }
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
