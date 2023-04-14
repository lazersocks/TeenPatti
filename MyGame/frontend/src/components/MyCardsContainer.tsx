import React from "react";
import Card from "./Card";
import "../styles/styles.Card.css";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

// type Card1 = {
//   rank: string;
//   suit: string;
//   back?: boolean;
// };
type Props = {
  name: string;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
};

export default function MyCardsContainer({ name, socket }: Props) {
  let handCards = useSelector((state: any) => state.handCards.handCards);
  const currentTurn = useSelector((state: any) => state.currentTurn.name);
  console.log("cards contauber ", handCards);
  // const innerCards = [
  //   { rank: "7", suit: "diams" },
  //   { rank: "q", suit: "hearts" },
  //   { rank: "3", suit: "spades" },
  // ];
  // const fixedCards = [
  //   { rank: "7", suit: "diams" },
  //   { rank: "8", suit: "hearts" },
  //   { rank: "3", suit: "spades" },
  // ];
  //handCards = [];

  const myTableCards = useSelector(
    (state: any) => state.myTableCards.tableCards
  );

  function chooseCard(rank: string, suit: string, type: string) {
    //use type to check if handCards are empyty or face up are empty
    console.log("in choose card ", type, rank, suit); //send type to tell playCard listner ke kider se card remove kerna
    if (
      (type === "face-up" || type === "face-down") &&
      handCards.length !== 0
    ) {
      console.log(type, "rejected");
      return;
    }

    if (
      handCards.length === 0 &&
      type === "face-down" &&
      myTableCards.length > 3
    ) {
      console.log(type, "secodn cond rejected");
      return;
    }

    if (name === currentTurn) {
      let back = false;
      if (type === "face-down") {
        back = true;
      }
      socket.emit("playCard", { rank, suit, back: back, type: type });
    }
  }
  return (
    <div>
      <div className="my-cards-inner-container">
        <ul className="hand remove-margin">
          {handCards.map((card: any, index: number) => (
            <li key={index}>
              {" "}
              <Card
                rank={card.rank}
                suit={card.suit}
                playingCards={false}
                onChooseCard={chooseCard}
                type="hand"
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="my-fixed-cards-container">
        <ul className="hand remove-margin">
          {myTableCards.map((card: any, index: number) => (
            <li key={index}>
              {" "}
              <Card
                rank={card.rank}
                suit={card.suit}
                playingCards={false}
                back={card.back}
                type={card.back ? "face-down" : "face-up"}
                onChooseCard={chooseCard}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
