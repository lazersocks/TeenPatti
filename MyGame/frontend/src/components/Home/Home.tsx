import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../styles.css";
import GameTable from "../GameTable";
import Header from "../Header/Header";
import MessageBox from "../MessageBox";
import MyCardsContainer from "../MyCardsContainer";
import { setPlayers } from "../features/connectedSlice";
//import { setMyTableCards } from "../features/myTableCardsSlice";
import { setTurn } from "../features/currenTurnSlice";
import { setMainCards } from "../features/mainCardsSlice";

//create an interface for the props that you want to pass to this component
interface HomePageProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>; //this is the type for sockets
  //you can always add more functions/objects that you would like as props for this component
}

function HomePage({ socket }: HomePageProps, msg: string) {
  //click handler
  const redux_count = useSelector<number>((state: any) => state.count.value);
  const dispatch = useDispatch();
  const [myName, setName] = useState<string>("");
  const [Loading, setLoading] = useState(false);
  const [winner, setWinner] = useState<string>("");
  const handCards = useSelector((state: any) => state.handCards.handCards);
  // const players = useSelector((state: any) => state.connected.players);

  socket.emit("connection", { data: myName });

  const handleClick = (socket: Socket, name: string) => {
    console.log("Socket ID:", socket.id);
    // Do something with the socket object, such as emit an event
    console.log("name", name);
    socket.emit("join", { message: name });
    setLoading(true);
  };

  // socket.on("setMyTableCards", (req) => {
  //   dispatch(setMyTableCards(req.data));
  // });

  // socket.on("mainCards", (data) => {
  //   dispatch(setMainCards(data.data));
  // });

  // socket.on("setTurn", (name) => {
  //   console.log("set turn", name);
  //   dispatch(setTurn(name));
  // });

  useEffect(() => {
    socket.on("playerJoined", (event) => {
      dispatch(setPlayers(event.data));
      console.log("count _rec", event.data);
    });

    // socket.on("setMyTableCards", (req) => {
    //   // hand cards which are on table [bottom cards]
    //   dispatch(setMyTableCards(req.data));
    // });

    socket.on("mainCards", (data) => {
      if (data.data === "reset") {
        console.log("in main cards reset");
        dispatch(setMainCards([]));
      } else {
        dispatch(setMainCards(data.data));
      }
    });

    socket.on("setTurn", (name) => {
      console.log("set turn", name);
      dispatch(setTurn(name));
      console.log("hand cards", handCards);
      if (name === myName && handCards.length !== 0) {
        socket.emit("verifyTurn", { id: socket.id });
      }
    });

    socket.on("setWinner", (name) => {
      setWinner(name);
    });

    return () => {
      // socket.off("setMyTableCards");
      socket.off("mainCards");
      socket.off("setTurn");
      socket.off("playerJoined");
      socket.off("setWinner");
    };
  }, [socket, dispatch, myName, handCards]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  if (winner !== "") {
    return (
      <div
        className="winner"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#fff",
        }}
      >
        <h1 style={{ fontSize: "3rem", color: "#000" }}>Winner is {winner}</h1>
      </div>
    );
  } else {
    return redux_count === 4 && myName !== "" ? (
      <div className="main-container playingCards">
        <div className="game-container">
          <Header />
          <div className="game-table-container">
            <GameTable socket={socket} myName={myName} />
          </div>
        </div>
        <div className="messages-and-cards-container">
          <div className="right-side-container messages-container">
            <h1>Messages</h1>
            <MessageBox socket={socket} />
          </div>
          <div className="right-side-container my-cards-container">
            <h1>My Cards</h1>
            <MyCardsContainer name={myName} socket={socket} />
          </div>
        </div>
      </div>
    ) : Loading ? (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#fff",
        }}
      >
        <h1 style={{ fontSize: "3rem", color: "#000" }}>Loading...</h1>
      </div>
    ) : (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "10%",
          }}
          className="sampleHomePage"
        >
          <h1
            style={{ fontSize: "3rem", marginBottom: "1rem" }}
            className="sampleTitle"
          >
            My Game
          </h1>
          <div
            style={{ display: "flex", alignItems: "center" }}
            className="sampleMessage"
          >
            <input
              placeholder="Enter your name"
              onChange={handleChange}
              style={{
                padding: "0.5rem",
                fontSize: "1.5rem",
                marginRight: "1rem",
              }}
            ></input>
            <button
              style={{
                padding: "0.5rem 1rem",
                fontSize: "1.5rem",
                backgroundColor: "#008CBA",
                color: "#fff",
                borderRadius: "5px",
              }}
              onClick={() => handleClick(socket, myName)}
            >
              Join
            </button>
          </div>
        </div>
      </>
    );
  }
}
export default HomePage;
