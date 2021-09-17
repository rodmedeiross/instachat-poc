import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { User } from "../../models";
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
}));

interface Props {
  user?: User;
}

export function ChatHeader(props: Props) {
  const classes = useStyles();
  const { user } = props || {};
  return (
    <div className={classes.container}>
      <Avatar className={classes.small} alt={user?.name} src="" />
      <Typography>{user?.name}</Typography>
    </div>
  );
}
