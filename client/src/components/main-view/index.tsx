import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { ChatHeader } from "../chat-header";
import { ChatContainer } from "../chat-container";
import { UserList } from "../user-list";
import users from "../../infrastructure/user-mock.json";
import { Typography } from "@material-ui/core";
import { User } from "../../models";
import { getChats, getDetailChats } from "../../API";
import { getUsers } from "../../API";

const useStyles = makeStyles({
  container: {
    height: "100%",
    width: "100%",
    display: "grid",
    gridTemplateAreas: `'userlist userheader'
                        'userlist chatview'`,
    gridTemplateRows: "50px 1fr",
    gridTemplateColumns: "300px 1fr",
  },
  list: {
    gridArea: "userlist",
  },
  chatContainer: {
    gridArea: "chatview",
  },
  userheader: {
    gridArea: "userheader",
  },
});

export default function MainView(props: any) {
  const classes = useStyles();
  const [chats, setChats] = React.useState<any>([]);
  const [users, setUsers] = React.useState<any>([]);
  const [currentUserId, setCurrentUserId] = React.useState<any>();
  const [currentChatId, setCurrentChat] = useState<string>();
  const [detailChat, setDetailChat] = useState<any>();

  React.useEffect(() => {
    const setup = async () => {
      try {
        const receivedUsers = await getUsers();
        setUsers(receivedUsers);
        setCurrentUserId(receivedUsers[0].id);
        setChats(await getChats({ userId: receivedUsers[0].id }));
      } catch (e) {
        alert("Error");
      }
    };

    setup();
  }, []);

  React.useEffect(() => {
    const getDetailChat = async () => {
      try {
        setDetailChat(
          await getDetailChats({
            userId: currentUserId,
            chatId: currentChatId as string,
          })
        );
      } catch (e) {
        alert("Error");
      }
    };

    if (currentChatId) {
      getDetailChat();
    }
  }, [currentChatId]);

  const handleCurrentGroup = (chatId: string) => {
    setCurrentChat(chatId);
  };

  const chat = chats.find((x: any) => x.id === currentChatId);

  return (
    <div className={classes.container}>
      <div className={classes.list}>
        <UserList
          chats={chats}
          onGroupSelect={handleCurrentGroup}
          currentGroupId={currentChatId}
        />
      </div>
      {currentChatId && detailChat ? (
        <>
          <div className={classes.userheader}>
            <ChatHeader chat={chat} />
          </div>
          <div className={classes.chatContainer}>
            <ChatContainer userId={currentUserId} chat={detailChat} />
          </div>
        </>
      ) : (
        <NoContent />
      )}
    </div>
  );
}

function NoContent() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Typography>No User Selected</Typography>
    </div>
  );
}
