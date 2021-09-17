import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { ChatHeader } from "../chat-header";
import { ChatContainer } from "../chat-container";
import { UserList } from "../user-list";
import { User } from "../../models";

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

const users: User[] = [
  {
    name: "Fernando",
    picture: "",
    status: "online",
    id: "1",
  },
  {
    name: "Rodrigo",
    picture: "",
    status: "offline",
    id: "2",
  },
  {
    name: "Luis",
    picture: "",
    status: "online",
    id: "3",
  },
];

export default function MainView(props: any) {
  const classes = useStyles();
  const [currentUserId, setCurrentUserId] = useState<string>();
  const handleCorrentUse = (userId: string) => {
    setCurrentUserId(userId);
  };
  const getUserById = (id?: string) => users.find((x) => x.id === id);

  return (
    <div className={classes.container}>
      <div className={classes.list}>
        <UserList
          onUserSelect={handleCorrentUse}
          users={users}
          currentUserId={currentUserId}
        />
      </div>
      <div className={classes.userheader}>
        <ChatHeader user={getUserById(currentUserId)} />
      </div>
      <div className={classes.chatContainer}>
        <ChatContainer />
      </div>
    </div>
  );
}
