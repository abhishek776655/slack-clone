import React, { useState } from "react";
import CreateChannelModal from "../components/CreateChannelModal";
import SendMessage from "../components/SendMessage";
import ChannelHeader from "../components/ChannelHeader";
import { gql, useQuery } from "@apollo/client";
import Channels from "../components/Channels";
import findIndex from "lodash/findIndex";
import InvitePeopleModal from "../components/InvitePeopleModal";
import Teams from "../components/Teams";
import decode from "jwt-decode";
import MessageContainer from "../components/MessageContainer";
import { Redirect } from "react-router";
const ViewTeam = ({ match: { params } }) => {
  const GET_TEAMS = gql`
    query {
      allTeams {
        id
        name
        owner
        channels {
          id
          name
        }
      }
      inviteTeams {
        id
        name
        owner
        channels {
          id
          name
        }
      }
    }
  `;
  const [openModal, setOpenModal] = useState(false);
  const [openInviteModal, setOpenInviteModal] = useState(false);
  const { loading, error, data } = useQuery(GET_TEAMS);
  if (loading) {
    return null;
  }
  if (error) {
    console.log(error);
    return null;
  }
  const teams = [...data.allTeams, ...data.inviteTeams];
  console.log(data);
  if (data.allTeams.length === 0) {
    return <Redirect to="/createTeam" />;
  }
  const currentTeamId = params.teamId;
  const currentChannelId = params.channelId;
  const currentTeamIdInteger = parseInt(currentTeamId);
  const teamIdx = !!currentTeamIdInteger
    ? findIndex(teams, ["id", parseInt(currentTeamIdInteger, 10)])
    : 0;

  const team = teams[teamIdx];
  const currentChannelIdInteger = parseInt(currentChannelId);
  const channelIdx = !!currentChannelIdInteger
    ? findIndex(team.channels, ["id", parseInt(currentChannelIdInteger, 10)])
    : 0;
  console.log(channelIdx);
  const channel = team.channels[channelIdx];
  let isOwner = false;
  let username = "";
  try {
    const token = localStorage.getItem("token");
    const { user } = decode(token);
    username = user.username;
    isOwner = user.id === team.owner;
    console.log(isOwner);
  } catch (e) {}
  return (
    <div className="h-screen grid grid-cols-1 grid-rows-header">
      <div className="bg-purple-dark">header</div>
      <div className="grid h-full grid-cols-layout grid-rows-layout">
        <Teams
          teams={teams.map((t) => ({
            id: t.id,
            letter: t.name.charAt(0).toUpperCase(),
          }))}
        />

        <Channels
          teamName={team.name}
          isOwner={isOwner}
          username={username}
          channels={team.channels}
          users={[
            { id: 1, name: "slackbot" },
            { id: 2, name: "slackbot" },
          ]}
          setOpenModal={setOpenModal}
          setOpenInviteModal={setOpenInviteModal}
          teamId={team.id}
        />
        <CreateChannelModal
          showModal={openModal}
          setShowModal={setOpenModal}
          teamId={team.id}
        />
        <InvitePeopleModal
          setOpenInviteModal={setOpenInviteModal}
          openInviteModal={openInviteModal}
          teamId={team.id}
        />
        {channel && <ChannelHeader channelName={channel.name} />}
        {channel && <MessageContainer channelId={channel.id} />}
        {channel && (
          <SendMessage channelName={channel.name} channelId={channel.id} />
        )}
      </div>
    </div>
  );
};

export default ViewTeam;
