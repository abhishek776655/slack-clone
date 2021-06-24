import React from "react";
import { Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

const channel = ({ id, name }, teamId) => (
  <Link to={`/view-team/${teamId}/${id}`}>
    {" "}
    <li
      className="text-lg text-gray-primary px-4 cursor-pointer hover:bg-gray-base"
      key={`channel-${id}`}
    >
      # {name}
    </li>
  </Link>
);
const user = ({ id, username }, teamId) => (
  <Link to={`/view-team/user/${teamId}/${id}`}>
    <li
      className="text-gray-primary text-base px-4 cursor-pointer hover:bg-gray-base"
      key={`user-${id}`}
    >
      {username}
    </li>
  </Link>
);
const Channels = (props) => {
  console.log(props.teamName);
  return (
    <div className="row-span-full bg-purple-medium">
      <div className="w-full border-t border-b border-gray-base mb-4">
        <div className="text-3xl py-3 px-1 text-white flex align-middle font-bold">
          {props.teamName}
        </div>
      </div>
      <div className="mb-4">
        <div className="px-3 flex items-baseline justify-between cursor-pointer mb-3">
          <div className="text-lg text-gray-primary h-full "> Channels</div>
          {props.isOwner && (
            <Icon
              name="add"
              className="text-gray-primary cursor-pointer hover:text-white"
              onClick={props.setOpenModal}
            ></Icon>
          )}
        </div>
        <ul>{props.channels.map((c) => channel(c, props.teamId))}</ul>
      </div>
      <div>
        <div className="px-3 flex items-baseline justify-between cursor-pointer mb-3">
          <div className="text-lg text-gray-primary h-full">
            Direct Messages
          </div>
          <Icon
            name="add"
            className="text-gray-primary cursor-pointer hover:text-white"
            onClick={() => props.directMessageClick(true)}
          ></Icon>
        </div>
        <div>{props.users.map((u) => user(u, props.teamId))}</div>
        {props.isOwner && (
          <div>
            <a
              href="#invite-people"
              onClick={() => props.setOpenInviteModal(true)}
            >
              + Invite People
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Channels;
