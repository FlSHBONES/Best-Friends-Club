import React from "react";

const GameMessage = props => {
  return (
    <div className="backdrop">
      <p onClick={() => props.resetClicked()}>{props.msg}</p>
    </div>
  );
};

export default GameMessage;
