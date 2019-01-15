import React from "react";
// import "./wrapper.css";

const CardList = props => {
  const displayTotal = (total, totalAlt) => {
    return total !== totalAlt && totalAlt <= 21
      ? total + "/" + totalAlt
      : total.toString();
  };

  return (
    <div style={{ height: 275 }}>
      <div className="mid">
        <span className="numDisplay">
          {props.cardDisplay +
            " " +
            displayTotal(props.cardTotal, props.cardTotalAlt)}
        </span>
      </div>
      <div className="mid">
        {props.cards.map(card => (
          <img src={card.images.png} height="200px" />
        ))}
      </div>
    </div>
  );
};

export default CardList;
