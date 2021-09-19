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
  const [currentMessage, setCurrentMessage] = React.useState<string>();

  return (
    <div className={classes.container}>
      <ChatView
        receivedMessage={user.receivedMessages}
        sendmessage={user.sendMessages}
      />
      <SendMessageContainer />
    </div>
  );
}
