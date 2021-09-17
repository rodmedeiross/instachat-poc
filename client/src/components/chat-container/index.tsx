import { makeStyles } from "@material-ui/styles";
import React from "react";
import { ChatView } from "./chat-view";
import { SendMessageContainer } from "./send-message-container";

const useStyles = makeStyles(() => ({
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
}));

export function ChatContainer() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <ChatView />
      <SendMessageContainer />
    </div>
  );
}
