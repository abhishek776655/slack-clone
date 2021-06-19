export default (sequelize, DataTypes) => {
  const Team = sequelize.define(
    "team",
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    { underscored: true }
  );
  Team.associate = (models) => {
    Team.belongsToMany(models.User, {
      through: models.Member,
      foreignKey: { name: "teamId", field: "team_id" },
    });
    Team.belongsTo(models.User, {
      foreignKey: { name: "owner", field: "owner" },
    });
  };
  return Team;
};
