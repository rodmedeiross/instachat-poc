import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { ChatHeader } from "../chat-header";
import { ChatContainer } from "../chat-container";
import { UserList } from "../user-list";
import users from "../../infrastructure/user-mock.json";
import { Typography } from "@material-ui/core";
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

export default function MainView(props: any) {
  const classes = useStyles();

  const [currentUserId, setCurrentUserId] = useState<string>();

  const handleCurrentUse = (userId: string) => {
    setCurrentUserId(userId);
  };

  const getUserById = (id?: string) => users.find((x) => x.id === id);

  return (
    <div className={classes.container}>
      <div className={classes.list}>
        <UserList
          onUserSelect={handleCurrentUse}
          users={users}
          currentUserId={currentUserId}
        />
      </div>
      {currentUserId ? (
        <>
          <div className={classes.userheader}>
            <ChatHeader user={getUserById(currentUserId)} />
          </div>
          <div className={classes.chatContainer}>
            <ChatContainer user={getUserById(currentUserId) as User} />
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
