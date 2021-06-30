import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState, useRef } from "react";
import Dropzone from "react-dropzone";
import { Button } from "@material-ui/core";
import Message from "../components/Message";
import { Comment } from "semantic-ui-react";
import CircularProgress from "@material-ui/core/CircularProgress";

const MESSAGES = gql`
  query ($teamId: Int!, $otherUserId: Int!, $cursor: Date) {
    directMessages(
      teamId: $teamId
      otherUserId: $otherUserId
      cursor: $cursor
    ) {
      id
      createdAt
      url
      filetype
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
      url
      filetype
      sender {
        username
      }
      text
    }
  }
`;
const DirectMessageContainer = ({ teamId, userId }) => {
  const scrollerRef = useRef(null);

  const [hasMoreItems, setHasMoreItems] = useState(true);
  console.log("userId,teamId", userId, teamId);
  const { subscribeToMore, data, loading, error, fetchMore } = useQuery(
    MESSAGES,
    {
      variables: { teamId, otherUserId: userId },
      fetchPolicy: "network-only",
    }
  );
  const subscribeToNewMessages = (teamId, userId) => {
    console.log("teamId", teamId);
    return subscribeToMore({
      document: DIRECT_MESSAGES_SUBSCRIPTION,
      variables: { userId, teamId },
      updateQuery: (prev, { subscriptionData }) => {
        console.log(subscriptionData.data);
        if (!subscriptionData.data) return prev;
        scrollerRef.current.scrollTop =
          scrollerRef.current.clientHeight + scrollerRef.current.scrollHeight;

        return {
          ...prev,
          directMessages: [
            subscriptionData.data.newDirectMessage,
            ...prev.directMessages,
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
  const messages = data.directMessages;

  return (
    <div
      className="px-3 flex flex-col-reverse overflow-y-scroll max-h-full"
      ref={scrollerRef}
    >
      <Dropzone onDrop={(files) => console.log(files)}>
        {({ getRootProps, getInputProps }) => (
          <div className="container">
            <input {...getInputProps()} />
            <Comment.Group className="min-w-full">
              {messages.length >= 5 && hasMoreItems && (
                <div className=" flex flex-row align-middle justify-center w-full">
                  <Button
                    color="secondary"
                    onClick={() => {
                      fetchMore({
                        variables: {
                          cursor: messages[messages.length - 1].createdAt,
                          teamId,
                          otherUserId: userId,
                        },
                        updateQuery: (prev, { fetchMoreResult }) => {
                          if (!fetchMoreResult) {
                            return;
                          }

                          if (fetchMoreResult.directMessages.length < 5) {
                            setHasMoreItems(false);
                          }
                          return {
                            ...prev,
                            directMessages: [
                              ...prev.directMessages,
                              ...fetchMoreResult.directMessages,
                            ],
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
                    <Comment.Author as="a">
                      {message.sender.username}
                    </Comment.Author>
                    <Comment.Metadata>
                      <div>{message.createdAt}</div>
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
        )}
      </Dropzone>
    </div>
  );
};
export default DirectMessageContainer;
