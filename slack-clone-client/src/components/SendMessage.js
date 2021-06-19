import React from "react";
import { Input } from "semantic-ui-react";
const SendMessage = ({ channelName }) => {
  return (
    <div className="m-5">
      <Input fluid placeholder={`Message # ${channelName}`}></Input>
    </div>
  );
};

export default SendMessage;
