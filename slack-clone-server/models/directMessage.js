export default (sequelize, DataTypes) => {
  const directMessage = sequelize.define(
    "direct_message",
    {
      text: {
        type: DataTypes.STRING,
      },
    },
    { underscored: true }
  );
  directMessage.associate = (models) => {
    directMessage.belongsTo(models.User, {
      foreignKey: { name: "receiverId", field: "receiver_id" },
    });
    directMessage.belongsTo(models.Team, {
      foreignKey: { name: "teamId", field: "team_id" },
    });
    directMessage.belongsTo(models.User, {
      foreignKey: { name: "senderId", field: "sender_id" },
    });
  };
  return directMessage;
};
