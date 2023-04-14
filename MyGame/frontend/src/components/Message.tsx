import React from "react";
type Props = {
  msg: string;
};

export default function Message({ msg }: Props) {
  return <div className="message-content-container">{msg}</div>;
}
