const channelBatcher = async (ids, models, user) => {
  const results = await models.sequelize.query(
    `select distinct on (id) *
  from channels as c left outer join pc_members as pc 
  on c.id = pc.channel_id
  where team_id in (:teamId) and public = true or (pc.user_id = :user_id);`,
    {
      replacements: { user_id: user.user.id, teamId: ids },
      model: models.Channel,
      raw: true,
    }
  );
  const data = {};
  results.forEach((element) => {
    if (data[element.team_id]) {
      data[element.team_id].push(element);
    } else {
      data[element.team_id] = [element];
    }
  });
  return ids.map((id) => data[id]);
};
export default channelBatcher;
