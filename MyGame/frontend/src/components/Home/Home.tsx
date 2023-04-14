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
import { setMyTableCards } from "../features/myTableCardsSlice";
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

    socket.on("setMyTableCards", (req) => {
      // hand cards which are on table [bottom cards]
      dispatch(setMyTableCards(req.data));
    });

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
      if (name === myName) {
        socket.emit("verifyTurn", { id: socket.id });
      }
    });

    socket.on("setWinner", (name) => {
      setWinner(name);
    });

    return () => {
      socket.off("setMyTableCards");
      socket.off("mainCards");
      socket.off("setTurn");
      socket.off("playerJoined");
      socket.off("setWinner");
    };
  }, [socket, dispatch, myName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return winner !== "" ? (
    redux_count === 2 ? (
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
      <div>loading</div>
    ) : (
      <>
        <div className="sampleHomePage">
          <h1 className="sampleTitle">My Game</h1>
          <div className="sampleMessage">
            <input
              placeholder="Enter your name"
              onChange={handleChange}
            ></input>
            <button onClick={() => handleClick(socket, myName)}>Join</button>
          </div>
        </div>
      </>
    )
  ) : (
    <div className="winner"></div>
  );
  {
    /* // <div className="main-container playingCards">
  //   <div className="game-container">
  //     <Header />
  //     <div className="game-table-container">
  //       <GameTable />
  //     </div>
  //   </div>
  //   <div className="messages-and-cards-container">
  //     <div className="right-side-container messages-container">
  //       <h1>Messages</h1>
  //       <MessageBox socket={socket} />
  //     </div>
  //     <div className="right-side-container my-cards-container">
  //       <h1>My Cards</h1>
  //       <MyCardsContainer />
  //     </div>
  //   </div>
  // </div>

  // <>
  //   <div className="sampleHomePage">
  //     <h1 className="sampleTitle">My Game</h1>
  //     <div className="sampleMessage">
  //       <input placeholder="message" onChange={handleChange}></input>
  //       <button onClick={() => handleClick(socket, msg2)}>
  //         Click me to send a message to server...
  //       </button>
  //     </div>
  //   </div>
  // </> */
  }
}
export default HomePage;
