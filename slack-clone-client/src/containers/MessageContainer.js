import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@material-ui/core";
import { Comment } from "semantic-ui-react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Message from "../components/Message";

const MESSAGES = gql`
  query ($channelId: Int!, $cursor: Date) {
    messages(channelId: $channelId, cursor: $cursor) {
      id
      text
      url
      filetype
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
      url
      filetype
      user {
        id
        username
      }
      createdAt
    }
  }
`;
const MessageContainer = ({ channelId }) => {
  const scrollerRef = useRef(null);

  const [hasMoreItems, setHasMoreItems] = useState(true);
  const { subscribeToMore, data, loading, error, fetchMore } = useQuery(
    MESSAGES,
    {
      variables: { channelId: channelId },
      fetchPolicy: "network-only",
    }
  );
  const subscribeToNewComments = (channelId) =>
    subscribeToMore({
      document: MESSAGES_SUBSCRIPTION,
      variables: { channelId: channelId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        console.log(prev);
        console.log(subscriptionData);
        scrollerRef.current.scrollTop =
          scrollerRef.current.clientHeight + scrollerRef.current.scrollHeight;
        return {
          ...prev,
          messages: [subscriptionData.data.newChannelMessage, ...prev.messages],
        };
      },
    });

  useEffect(() => {
    console.log("subscribe", channelId);
    if (data) {
      if (data.messages.length >= 15) {
        setHasMoreItems(true);
      }
    }
    const unsubscribe = subscribeToNewComments(channelId);
    return function cleanup() {
      console.log("unsubscribe");
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);

  if (loading) return null;
  if (error) return `Error! ${error}`;
  console.log(data);
  const messages = data.messages;
  return (
    <div
      className="px-3 f flex flex-col-reverse overflow-y-scroll max-h-full w-full"
      ref={scrollerRef}
    >
      <Comment.Group className="min-w-full">
        {messages.length >= 5 && hasMoreItems && (
          <div className=" flex flex-row align-middle justify-center w-full">
            <Button
              color="secondary"
              onClick={() => {
                fetchMore({
                  variables: {
                    cursor: messages[messages.length - 1].createdAt,
                    channelId,
                  },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) {
                      return;
                    }

                    if (fetchMoreResult.messages.length < 15) {
                      setHasMoreItems(false);
                    }

                    return {
                      ...prev,
                      messages: [...prev.messages, ...fetchMoreResult.messages],
                    };
                  },
                });
              }}
            >
              {loading ? (
                <CircularProgress size={18} color="secondary" />
              ) : (
                <p>load more</p>
              )}
            </Button>
          </div>
        )}
        {[...messages].reverse().map((message) => (
          <Comment key={message.id}>
            <Comment.Content>
              <Comment.Author as="a">{message.user.username}</Comment.Author>
              <Comment.Metadata>
                <div>{new Date(message.createdAt).getDay()}</div>
              </Comment.Metadata>
              <Message message={message} />
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
