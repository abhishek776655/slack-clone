export default (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "message",
    {
      text: {
        type: DataTypes.STRING,
      },
      url: DataTypes.STRING,
      filetype: DataTypes.STRING,
    },
    {
      underscored: true,
      indexes: [
        {
          fields: ["created_at"],
        },
      ],
    }
  );
  Message.associate = (models) => {
    Message.belongsTo(models.Channel, {
      foreignKey: { name: "channelId", field: "channel_id" },
    });
    Message.belongsTo(models.User, {
      foreignKey: { name: "userId", field: "user_id" },
    });
  };
  return Message;
};
