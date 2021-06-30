import React, { useState, useEffect } from "react";

const RenderText = ({ url }) => {
  const [text, setText] = useState("");
  useEffect(() => {
    const fetch = async () => {
      const response = await fetch(url);
      setText(await response.text());
    };
  }, []);
  return (
    <div>
      <div>---------</div>
      <p>{text}</p>
      <div>---------</div>
    </div>
  );
};

export default RenderText;
