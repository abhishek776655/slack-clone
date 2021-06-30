import React from "react";
import RenderText from "../components/RenderText";
import { Comment } from "semantic-ui-react";

const message = ({ message: { url, text, filetype } }) => {
  if (url) {
    if (filetype.startsWith("image/")) {
      return (
        <img
          style={{
            maxHeight: "300px",
            maxWidth: "300px",
            height: "150px",
            width: "150px",
          }}
          src={url}
          alt=""
        ></img>
      );
    } else if (filetype.startsWith("text/plain")) {
      return <RenderText url={url}></RenderText>;
    } else if (filetype.startsWith("audio/")) {
      return (
        <div>
          <audio control="controls">
            <source src={url} type={filetype}></source>
          </audio>
        </div>
      );
    }
  }
  return <Comment.Text>{text}</Comment.Text>;
};

export default message;
