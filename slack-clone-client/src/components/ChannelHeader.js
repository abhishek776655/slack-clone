import React from "react";
import { Header } from "semantic-ui-react";
const ChannelHeader = (props) => {
  console.log(props.directMessageMembers);

  let channelHeader;
  if (props.directMessageMembers && props.directMessageMembers.length > 0) {
    const user = props.directMessageMembers.filter(
      (e) => e.id === props.otherUserId
    );
    channelHeader = user[0].username;
  }
  if (props.channelName) {
    channelHeader = props.channelName;
  }

  return (
    <div className="flex justify-center bg-gray-primary">
      <Header className="">{channelHeader}</Header>
    </div>
  );
};

export default ChannelHeader;
