import React, { useState } from "react";
import CreateChannelModal from "../components/CreateChannelModal";
import SendMessage from "../components/SendMessage";
import ChannelHeader from "../components/ChannelHeader";
import { gql, useQuery, useMutation } from "@apollo/client";
import Channels from "../components/Channels";
import findIndex from "lodash/findIndex";
import InvitePeopleModal from "../components/InvitePeopleModal";
import Teams from "../components/Teams";
import decode from "jwt-decode";
import MessageContainer from "../components/MessageContainer";
import { Redirect } from "react-router";
import DirectMessageModal from "../components/DirectMessageModal";

const CREATE_MESSAGE = gql`
  mutation ($message: String!, $channelId: Int!) {
    createMessage(channelId: $channelId, text: $message)
  }
`;
const ME_QUERY = gql`
  query {
    me {
      id
      email
      username
      teams {
        id
        name
        admin
        directMessageMembers {
          username
          id
        }
        channels {
          id
          name
        }
      }
    }
  }
`;

const ViewTeam = ({ match: { params } }) => {
  const [onCreateMessage] = useMutation(CREATE_MESSAGE);

  const [openModal, setOpenModal] = useState(false);
  const [openInviteModal, setOpenInviteModal] = useState(false);
  const [openDirectMessageModal, setOpenDirectMessageModal] = useState(false);

  const { loading, error, data } = useQuery(ME_QUERY, {
    fetchPolicy: "network-only",
  });
  if (loading) {
    return null;
  }
  if (error) {
    console.log(error);
    return null;
  }
  const { teams } = data.me;
  console.log(data);
  if (teams && teams.length === 0) {
    return <Redirect to="/createTeam" />;
  }
  const currentTeamId = params.teamId;
  const currentChannelId = params.channelId;
  const currentTeamIdInteger = parseInt(currentTeamId);
  let teamIdx = currentTeamIdInteger
    ? findIndex(teams, ["id", parseInt(currentTeamIdInteger, 10)])
    : 0;
  console.warn(teamIdx);
  if (teamIdx === -1) {
    teamIdx = 0;
  }
  const team = teams[teamIdx];
  const currentChannelIdInteger = parseInt(currentChannelId);
  let channelIdx = currentChannelIdInteger
    ? findIndex(team.channels, ["id", parseInt(currentChannelIdInteger, 10)])
    : 0;
  console.log(channelIdx);
  if (channelIdx === -1) {
    channelIdx = 0;
  }
  const channel = team.channels[channelIdx];
  let isOwner = false;
  let username = "";
  console.log(team.directMessageMembers);
  try {
    const token = localStorage.getItem("token");
    const { user } = decode(token);
    username = user.username;
    isOwner = team.admin;
    console.log(isOwner);
  } catch (e) {}
  return (
    <div className="h-screen grid grid-cols-1 grid-rows-header ">
      <div className="bg-purple-dark">header</div>
      <div className="grid h-full grid-cols-layout grid-rows-layout overflow-y-hidden">
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
          users={team.directMessageMembers}
          setOpenModal={setOpenModal}
          setOpenInviteModal={setOpenInviteModal}
          teamId={team.id}
          directMessageClick={setOpenDirectMessageModal}
        />
        <CreateChannelModal
          showModal={openModal}
          setShowModal={setOpenModal}
          teamId={team.id}
        />
        <DirectMessageModal
          showModal={openDirectMessageModal}
          setShowModal={setOpenDirectMessageModal}
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
          <SendMessage
            placeholder={channel.name}
            onSubmit={async (text) => {
              console.log(text);
              console.log(channel.id);
              await onCreateMessage({
                variables: { channelId: channel.id, message: text },
              });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ViewTeam;
