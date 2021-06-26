import React from "react";
import SendMessage from "../components/SendMessage";
import ChannelHeader from "../components/ChannelHeader";
import { gql, useQuery, useMutation } from "@apollo/client";
import findIndex from "lodash/findIndex";
import Sidebar from "../containers/Sidebar";
import decode from "jwt-decode";
import DirectMessageContainer from "../containers/DirectMessageContainer";
import { Redirect } from "react-router";

const CREATE_DIRECT_MESSAGE = gql`
  mutation ($receiverId: Int!, $text: String, $teamId: Int!) {
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
  const otherUserId = parseInt(params.userId);

  // const otherUserIdInteger = parseInt(
  //   JSON.parse(JSON.stringify(otherUserId)),
  //   10
  // );
  const { loading, error, data } = useQuery(DIRECT_MESSAGE_ME_QUERY, {
    //causing Re unnecessary re rendering
    // fetchPolicy: "network-only",
    variables: {
      userId: otherUserId,
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
  const currentTeamId = params.teamId;
  const userId = params.userId;
  const userIdInt = parseInt(userId);

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

  return (
    <div className="h-screen grid grid-cols-1 grid-rows-header ">
      <div className="bg-purple-dark">header</div>
      <div className="grid h-full grid-cols-layout overflow-y-hidden">
        <Sidebar
          teams={teams.map((t) => ({
            id: t.id,
            letter: t.name.charAt(0).toUpperCase(),
          }))}
          team={team}
          username={username}
        />
        <div className="grid grid-rows-layout">
          <ChannelHeader channelName={data.getUser.username} />
          <DirectMessageContainer teamId={team.id} userId={userIdInt} />
          {
            <SendMessage
              placeHolder={userIdInt}
              isDirectMessage={true}
              userId={userIdInt}
              teamId={team.id}
              onSubmit={async (text) => {
                await onCreateDirectMessage({
                  variables: {
                    text: text,
                    receiverId: userIdInt,
                    teamId: currentTeamIdInteger,
                  },
                });
              }}
            />
          }
        </div>
      </div>
    </div>
  );
};

export default DirectMessages;
DirectMessages.whyDidYouRender = true;
