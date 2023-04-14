import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import Message from "./Message";
interface MessageBoxProp {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>; //this is the type for sockets
  //you can always add more functions/objects that you would like as props for this component
}
export default function MessageBox({ socket }: MessageBoxProp) {
  const [messages, setMessages] = useState<string[]>([
    "Latest message comes here",
  ]);

  useEffect(() => {
    socket.on("message", (msg) => {
      setMessages((messages) => [...messages, msg].reverse());

      return () => {
        socket.off("message");
      };
    });
  }, [socket]);

  return (
    <div className="message-box">
      {messages.map((msg) => (
        <Message msg={msg} />
      ))}
    </div>
  );
}
