import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Chat } from "../../models";
import { Avatar, Theme, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    height: "50px",
    background: "#f5f5f5",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "10px",
    borderBottom: "1px solid lightgray",
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  description: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "10px",
  },
}));

interface Props {
  chat?: Chat;
}

export function ChatHeader(props: Props) {
  const classes = useStyles();
  const { chat } = props || {};

  return (
    <div className={classes.container}>
      <Avatar className={classes.small} alt={chat?.id} src="" />
      <div className={classes.description}>
        <Typography>{chat?.title}</Typography>
        {/* <Typography
          variant="caption"
          style={{ color: user?.status == "online" ? "#4caf50" : "#f44336" }}
        >
          {user?.status}
        </Typography> */}
      </div>
    </div>
  );
}
