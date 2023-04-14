import Card from "./Card";
import "../styles.css";
import "../styles/styles.Card.css";
import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { useDispatch, useSelector } from "react-redux";
import { setHandCards } from "./features/handCardsSlice";
import { setMyTableCards } from "./features/myTableCardsSlice";

interface TableProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  myName: string;
}
type Card1 = {
  rank: string;
  suit: string;
  back: boolean;
};
type Player = {
  name: string;
  tag: string;
  cards: Card1[];
  handCards: Card1[];
};

function GameTable({ socket, myName }: TableProps) {
  // const players = [
  //   {
  //     name: "Esha",
  //     tag: "player-one",
  //     cards: [
  //       { rank: "6", suit: "diams", back: true },
  //       { rank: "6", suit: "hearts", back: true },
  //       { rank: "6", suit: "diams", back: true },
  //     ],
  //   },
  //   {
  //     name: "Saood",
  //     tag: "player-two",
  //     cards: [
  //       { rank: "6", suit: "diams", back: true },
  //       { rank: "6", suit: "diams", back: false },
  //       { rank: "6", suit: "diams", back: false },
  //     ],
  //   },
  //   {
  //     name: "Ahmed",
  //     tag: "player-three",
  //     cards: [
  //       { rank: "6", suit: "diams", back: false },
  //       { rank: "6", suit: "diams", back: false },
  //       { rank: "6", suit: "diams", back: false },
  //     ],
  //   },
  //   {
  //     name: "Mahd",
  //     tag: "player-four",
  //     cards: [
  //       { rank: "6", suit: "spades", back: false },
  //       { rank: "6", suit: "hearts", back: false },
  //       { rank: "6", suit: "hearts", back: false },
  //     ],
  //   },
  // ];
  function myHandCards(players: any[], myName: string) {
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      if (player.name === myName) {
        console.log("in my hand cards");
        return player.handCards;
      }
    }
  }
  function myTableCards(players: any[], myName: string) {
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      if (player.name === myName) {
        console.log("in my table cards");
        return player.cards;
      }
    }
  }
  const dispatch = useDispatch();
  const mainCards = useSelector((state: any) => state.mainCards.mainCards);

  // useEffect(() => {
  //   socket.on("mainCards", (data) => {
  //     console.log("data in main cards", data);
  //     setMainCards((mainCards: any) => [...mainCards, data.data]);
  //   });
  // }, [socket]);

  const [players, setPlayers] = useState<Player[]>([]);

  console.log("players", players);

  useEffect(() => {
    socket.on("gameStarted", (res) => {
      setPlayers(res.data);
      console.log("setPlayers", res.data);
      let cards = myHandCards(res.data, myName);
      let table = myTableCards(res.data, myName); //these are private cards shown in card container
      console.log("table cards from server", table);
      //console.log("cards", cards);
      if (cards.length === 0 && table.length === 0) {
        socket.emit("win", { name: myName });
      }
      dispatch(setHandCards(cards));
      dispatch(setMyTableCards(table));

      /// add win condition to check if the player'hand cards are empty and table cards are empty
    });
    //console.log("players", players);

    //console.log("myHandCards func", myHandCards());
  }, [socket, dispatch, myName]);

  // useEffect(() => {
  //   let cards = myHandCards(players, myName);
  //   console.log("cards", cards);
  //   dispatch(setHandCards(cards));
  // }, [players]);

  return (
    <div className="game-table">
      <div className="card-area">
        <ul className="hand remove-margin">
          {Array.isArray(mainCards) &&
            mainCards.map((card, index) => (
              <li key={index}>
                {" "}
                <Card
                  rank={card.rank}
                  suit={card.suit}
                  playingCards={true}
                  type="table"
                />
              </li>
            ))}
        </ul>
      </div>
      {Array.isArray(players) &&
        players.map((player, index) => (
          <div className="game-players-container" key={index}>
            <div className={`player-tag ${player.tag}`}>{player.name}</div>
            <ul className={`hand remove-margin ${player.tag}-cards`}>
              {player.cards.map((card, index) => (
                <li key={index}>
                  {" "}
                  <Card
                    rank={card.rank}
                    suit={card.suit}
                    playingCards={true}
                    back={card.back}
                    type="table"
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}

export default GameTable;
