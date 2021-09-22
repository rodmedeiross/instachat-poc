import { makeStyles } from "@material-ui/styles";
import React, { useState } from "react";
import {Chat, User} from "../../models";
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
  users: User[];
}

export function ChatContainer({ users, chatId, userId }: Props) {
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
    return chat.messages
        .filter((x) => x.fromUserId !== userId)
        .map(x => ({...x, fromUserName: users.find(u => u.id == x.fromUserId)?.name }));
  };

  const getSendMessages = () => {
    debugger
    return chat.messages
        .filter((x) => x.fromUserId === userId)
        .map(x => ({...x, fromUserName: users.find(u => u.id == x.fromUserId)?.name }));
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
