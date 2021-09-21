import { makeStyles } from "@material-ui/styles";
import React from "react";
import { Chat, User } from "../../models";
import { ChatView } from "./chat-view";
import { SendMessageContainer } from "./send-message-container";
import "react-chat-elements/dist/main.css";

const useStyles = makeStyles(() => ({
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "10px",
  },
}));

interface Props {
  chat: Chat;
  userId: string;
}

export function ChatContainer({ chat, userId }: Props) {
  const classes = useStyles();

  const getRecivedMessage = () => {
    return chat.messages
      .filter((x) => x.fromUser === userId)
      .map((x) => ({ date: x.timeStamp, message: x.text }));
  };

  const getSendMessages = () => {
    return chat.messages
      .filter((x) => x.fromuser !== userId)
      .map((x: any) => ({ date: x.timeStamp, message: x.text }));
  };

  return (
    <div className={classes.container}>
      <ChatView
        receivedMessage={getRecivedMessage()}
        sendmessage={getSendMessages()}
      />
      <SendMessageContainer userId={userId} chatId={chat.id} />
    </div>
  );
}
