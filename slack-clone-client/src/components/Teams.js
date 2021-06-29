import React from "react";
import { Link } from "react-router-dom";

const team = ({ id, letter }) => (
  <Link to={`/view-team/${id}`} key={`team-${id}`}>
    <li
      className="h-12 w-12 bg-team-background
    text-white m-auto mb-2.5 flex 
    justify-center text-2xl rounded-lg border-0 pt-1.5 hover:bg-team-borderColor"
    >
      {letter}
    </li>
  </Link>
);
const Teams = (props) => {
  return (
    <div className="row-span-full bg-purple-dark">
      <ul className="w-full">{props.teams.map(team)}</ul>
    </div>
  );
};

export default Teams;
