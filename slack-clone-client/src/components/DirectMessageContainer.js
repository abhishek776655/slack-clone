import { gql, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { Comment } from "semantic-ui-react";
const MESSAGES = gql`
  query ($teamId: Int!, $otherUserId: Int!) {
    directMessages(teamId: $teamId, otherUserId: $otherUserId) {
      id
      createdAt
      sender {
        username
      }
      text
    }
  }
`;
const DIRECT_MESSAGES_SUBSCRIPTION = gql`
  subscription ($teamId: Int!, $userId: Int!) {
    newDirectMessage(teamId: $teamId, userId: $userId) {
      id
      createdAt
      sender {
        username
      }
      text
    }
  }
`;
const DirectMessageContainer = ({ teamId, userId }) => {
  console.log("userId,teamId", userId, teamId);
  const { subscribeToMore, data, loading, error } = useQuery(MESSAGES, {
    variables: { teamId, otherUserId: userId },
    fetchPolicy: "network-only",
  });
  const subscribeToNewMessages = (teamId, userId) => {
    console.log("teamId", teamId);
    return subscribeToMore({
      document: DIRECT_MESSAGES_SUBSCRIPTION,
      variables: { userId, teamId },
      updateQuery: (prev, { subscriptionData }) => {
        console.log(subscriptionData.data);
        if (!subscriptionData.data) return prev;

        return {
          ...prev,
          directMessages: [
            ...prev.directMessages,
            subscriptionData.data.newDirectMessage,
          ],
        };
      },
    });
  };

  useEffect(() => {
    const unsubscribe = subscribeToNewMessages(teamId, userId);
    return function cleanup() {
      console.log("unsubscribe");
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, userId]);

  if (loading) return null;
  if (error) return `Error! ${error}`;
  console.log(data);
  return (
    <div className="px-3 flex flex-col-reverse overflow-y-scroll max-h-full">
      <Comment.Group>
        {data.directMessages.map((message) => (
          <Comment key={message.id}>
            <Comment.Content>
              <Comment.Author as="a">{message.sender.username}</Comment.Author>
              <Comment.Metadata>
                <div>{message.createdAt}</div>
              </Comment.Metadata>
              <Comment.Text>{message.text}</Comment.Text>
              <Comment.Actions>
                <Comment.Action>Reply</Comment.Action>
              </Comment.Actions>
            </Comment.Content>
          </Comment>
        ))}
      </Comment.Group>
    </div>
  );
};
export default DirectMessageContainer;
