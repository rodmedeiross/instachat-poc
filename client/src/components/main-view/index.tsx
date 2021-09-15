import React from "react";
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
  },
  {
    name: "Rodrigo",
    picture: "",
    status: "offline",
  },
];

export default function MainView() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.list}>
        <UserList users={users} />
      </div>
      <div className={classes.userheader}>
        <ChatHeader />
      </div>
      <div className={classes.chatContainer}>
        <ChatContainer />
      </div>
    </div>
  );
}
