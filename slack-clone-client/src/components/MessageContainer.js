import { gql, useQuery } from "@apollo/client";
import React from "react";
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
const MessageContainer = ({ channelId }) => {
  const { data, loading, error } = useQuery(MESSAGES, {
    variables: { channelId: channelId },
  });

  if (loading) return null;
  if (error) return `Error! ${error}`;

  return (
    <div className="px-3">
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
