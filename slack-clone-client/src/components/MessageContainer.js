import { gql, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { Comment } from "semantic-ui-react";
const MESSAGES = gql`
  query ($channelId: Int!) {
    messages(channelId: $channelId) {
      id
      text
      user {
        id
        username
      }
      createdAt
    }
  }
`;
const MESSAGES_SUBSCRIPTION = gql`
  subscription ($channelId: Int!) {
    newChannelMessage(channelId: $channelId) {
      id
      text
      user {
        id
        username
      }
      createdAt
    }
  }
`;
const MessageContainer = ({ channelId }) => {
  const { subscribeToMore, data, loading, error } = useQuery(MESSAGES, {
    variables: { channelId: channelId },
  });
  const subscribeToNewComments = () =>
    subscribeToMore({
      document: MESSAGES_SUBSCRIPTION,
      variables: { channelId: channelId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        console.log(prev);
        console.log(subscriptionData);
        return {
          ...prev,
          messages: [...prev.messages, subscriptionData.data.newChannelMessage],
        };
      },
    });
  useEffect(() => {
    subscribeToNewComments();
  }, []);

  if (loading) return null;
  if (error) return `Error! ${error}`;
  console.log(data);
  return (
    <div className="px-3 flex flex-col-reverse overflow-y-scroll max-h-full">
      <Comment.Group>
        {data.messages.map((message) => (
          <Comment key={message.id}>
            <Comment.Content>
              <Comment.Author as="a">{message.user.username}</Comment.Author>
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
export default MessageContainer;
