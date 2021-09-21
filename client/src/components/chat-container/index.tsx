import { makeStyles } from "@material-ui/styles";
import React, { useState } from "react";
import { Chat } from "../../models";
import { ChatView } from "./chat-view";
import { SendMessageContainer } from "./send-message-container";
import "react-chat-elements/dist/main.css";
import { getDetailChats, sendMessage } from "../../API";

const useStyles = makeStyles(() => ({
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "10px",
  },
}));

interface Props {
  chatId: string;
  userId: string;
}

export function ChatContainer({ chatId, userId }: Props) {
  const classes = useStyles();

  const [chat, setChat] = useState<any>({ messages: [] });

  const getDetailChat = async () => {
    try {
      setChat(
        await getDetailChats({
          userId,
          chatId,
        })
      );
    } catch (e) {
      alert("Error");
    }
  };

  React.useEffect(() => {
    if (chatId) {
      getDetailChat();
    }
  }, [chatId]);

  const getRecivedMessage = () => {
    return chat.messages.filter((x) => x.fromUser === userId);
  };

  const getSendMessages = () => {
    return chat.messages.filter((x) => x.fromuser !== userId);
  };

  return (
    <div className={classes.container}>
      <ChatView
        receivedMessage={getRecivedMessage()}
        sendmessage={getSendMessages()}
      />
      <SendMessageContainer
        onSendMessage={(message) => {
          (async () => {
            await sendMessage({
              chatId: chat.id,
              userId,
              message,
            });
            await getDetailChat();
          })();
        }}
      />
    </div>
  );
}
