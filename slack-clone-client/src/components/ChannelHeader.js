import React from "react";
import { Header } from "semantic-ui-react";
const ChannelHeader = (props) => {
  return (
    <div className="flex justify-center bg-gray-primary">
      <Header className="">#{props.channelName}</Header>
    </div>
  );
};

export default ChannelHeader;
