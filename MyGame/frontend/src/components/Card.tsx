import React from "react";
import "../styles/styles.Card.css";
type Props = {
  rank: string;
  suit: string;
  playingCards: boolean;
  back?: boolean;
  onChooseCard?: (rank: string, suit: string, type: string) => void;
  type: string;
};

export default function Card({
  rank,
  suit,
  playingCards,
  back,
  onChooseCard,
  type,
}: Props) {
  const symbol: any = {
    spades: "♠",
    hearts: "♥",
    diams: "♦",
    clubs: "♣",
  };
  let rank2 = rank;
  if (rank === "q") {
    rank2 = "Q";
  } else if (rank === "k") {
    rank2 = "K";
  } else if (rank === "a") {
    rank2 = "A";
  } else if (rank === "j") {
    rank2 = "J";
  }

  return playingCards ? (
    back ? (
      <div className="card back">*</div>
    ) : (
      <div className={`playingCards card rank-${rank} ${suit}`}>
        <span className="rank">{rank2}</span>
        <span className="suit">{symbol[suit]}</span>
      </div>
    )
  ) : back ? (
    <div
      className="card back"
      onClick={() => onChooseCard && onChooseCard(rank, suit, type)}
    >
      *
    </div>
  ) : (
    <a
      className={`card rank-${rank} ${suit}`}
      onClick={() => onChooseCard && onChooseCard(rank, suit, type)}
    >
      <span className="rank">{rank2}</span>
      <span className="suit">{symbol[suit]}</span>
    </a>
  );
}
