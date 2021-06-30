import React from "react";
import SendMessage from "../components/SendMessage";
import ChannelHeader from "../components/ChannelHeader";
import { gql, useQuery, useMutation } from "@apollo/client";
import findIndex from "lodash/findIndex";
import Sidebar from "../containers/Sidebar";
import decode from "jwt-decode";
import MessageContainer from "../containers/MessageContainer";
import { Redirect } from "react-router";

const CREATE_MESSAGE = gql`
  mutation ($message: String, $channelId: Int!) {
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
  const { loading, error, data } = useQuery(ME_QUERY, {
    // fetchPolicy: "network-only",
  });
  if (loading) {
    return null;
  }
  if (error) {
    console.log(error);
    return null;
  }
  const { id, teams } = data.me;
  console.log("id", id);
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
    <div className="h-screen grid grid-cols-1 grid-rows-header">
      <div className="bg-purple-dark">header</div>
      <div className="grid h-full grid-cols-layout overflow-hidden">
        <Sidebar
          teams={teams.map((t) => ({
            id: t.id,
            letter: t.name.charAt(0).toUpperCase(),
          }))}
          team={team}
          username={username}
          currentUserId={id}
        />
        <div className="grid grid-rows-layout overflow-hidden">
          {channel && <ChannelHeader channelName={channel.name} />}
          {channel && <MessageContainer channelId={channel.id} />}
          {channel && (
            <SendMessage
              isDirectMessage={false}
              channelId={channel.id}
              placeholder={channel.name}
              onSubmit={async (text) => {
                console.log(text);

                await onCreateMessage({
                  variables: {
                    channelId: channel.id,
                    message: text,
                  },
                });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewTeam;
