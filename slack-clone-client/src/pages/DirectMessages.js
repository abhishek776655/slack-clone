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
import DirectMessageContainer from "../components/DirectMessageContainer";
import { Redirect } from "react-router";
import DirectMessageModal from "../components/DirectMessageModal";

const CREATE_DIRECT_MESSAGE = gql`
  mutation ($receiverId: Int!, $text: String!, $teamId: Int!) {
    createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
  }
`;

const DIRECT_MESSAGE_ME_QUERY = gql`
  query ($userId: Int!) {
    getUser(userId: $userId) {
      username
    }
    me {
      id
      email
      username
      teams {
        id
        name
        admin
        directMessageMembers {
          id
          username
        }
        channels {
          id
          name
        }
      }
    }
  }
`;
const DirectMessages = ({ match: { params } }) => {
  const { loading, error, data } = useQuery(DIRECT_MESSAGE_ME_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      userId: parseInt(params.userId, 10),
    },
  });
  const [onCreateDirectMessage] = useMutation(CREATE_DIRECT_MESSAGE, {
    update(cache) {
      const cacheData = cache.readQuery({
        query: gql`
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
                  id
                  username
                }
                channels {
                  id
                  name
                }
              }
            }
          }
        `,
      });

      const teamIdx = findIndex(cacheData.me.teams, ["id", parseInt(team.id)]);
      const newData = JSON.parse(JSON.stringify(cacheData));
      let alreadyPresent = newData.me.teams[teamIdx].directMessageMembers.every(
        (user) => user.id !== parseInt(params.userId, 10)
      );
      if (alreadyPresent) {
        newData.me.teams[teamIdx].directMessageMembers.push({
          __typename: "User",
          id: parseInt(params.userId, 10),
          username: data.getUser.username,
        });
      }
      cache.writeQuery({
        query: gql`
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
                  id
                  username
                }
                channels {
                  id
                  name
                }
              }
            }
          }
        `,
        data: newData,
      });
    },
  });

  const [openModal, setOpenModal] = useState(false);
  const [openInviteModal, setOpenInviteModal] = useState(false);
  const [openDirectMessageModal, setOpenDirectMessageModal] = useState(false);

  if (loading) {
    return null;
  }
  if (error) {
    console.log(error);
    return null;
  }
  const { teams } = data.me;
  if (teams && teams.length === 0) {
    return <Redirect to="/createTeam" />;
  }
  const currentTeamId = parseInt(params.teamId);
  const userId = parseInt(params.userId);
  const currentTeamIdInteger = parseInt(currentTeamId);
  let teamIdx = !!currentTeamIdInteger
    ? findIndex(teams, ["id", parseInt(currentTeamIdInteger, 10)])
    : 0;
  if (teamIdx === -1) {
    teamIdx = 0;
  }
  const team = teams[teamIdx];

  let isOwner = false;
  let username = "";
  try {
    const token = localStorage.getItem("token");
    const { user } = decode(token);
    username = user.username;
    isOwner = team.admin;
    console.log(isOwner);
  } catch (e) {}
  console.log("user", userId);
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
          directMessageClick={setOpenDirectMessageModal}
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
        <DirectMessageModal
          showModal={openDirectMessageModal}
          setShowModal={setOpenDirectMessageModal}
          teamId={team.id}
        />
        <ChannelHeader channelName={data.getUser.username} />
        <DirectMessageContainer teamId={team.id} userId={userId} />
        {
          <SendMessage
            placeHolder={userId}
            onSubmit={async (text) => {
              console.log("currentTeam", currentTeamId);
              await onCreateDirectMessage({
                variables: {
                  text: text,
                  receiverId: userId,
                  teamId: currentTeamId,
                },
              });
            }}
          />
        }
      </div>
    </div>
  );
};

export default DirectMessages;
