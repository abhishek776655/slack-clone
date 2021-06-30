import React from "react";
import { gql, useQuery } from "@apollo/client";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

const GET_TEAM_MEMBERS = gql`
  query ($teamId: Int!) {
    getTeamMembers(teamId: $teamId) {
      username
      id
      email
    }
  }
`;

const MultiSelectUser = ({
  teamId,
  className,
  label,
  placeholder,
  handleChange,
  value,
  currentUserId,
}) => {
  const { data, loading } = useQuery(GET_TEAM_MEMBERS, {
    variables: { teamId: teamId },
  });

  if (loading) {
    return;
  }
  console.log(currentUserId);
  return (
    <Autocomplete
      multiple
      className={className}
      id="tags-outlined"
      options={data.getTeamMembers
        .filter((e) => e.id !== currentUserId)
        .map((m) => {
          return {
            ...m,
            title: m.username,
          };
        })}
      value={value}
      onChange={handleChange}
      loading={loading}
      getOptionLabel={(option) => option.title}
      filterSelectedOptions
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label={label}
          placeholder={placeholder}
        />
      )}
    />
  );
};

export default MultiSelectUser;
