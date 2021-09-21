import { makeStyles } from "@material-ui/styles";
import React from "react";
import { User } from "../../models";
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
  user: User;
}

export function ChatContainer({ user }: Props) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <ChatView
        receivedMessage={user.receivedMessages}
        sendmessage={user.sendMessages}
      />
      <SendMessageContainer
        userId={user.id}
        chatId={"6149291fb19dad1f1969630c"}
      />
    </div>
  );
}
