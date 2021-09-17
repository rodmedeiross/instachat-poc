import { makeStyles } from "@material-ui/styles";
import React from "react";

const useStyles = makeStyles(() => ({
  container: {
    flexGrow: 1,
  },
}));

export function ChatView() {
  const classes = useStyles();
  return <div className={classes.container}>asd</div>;
}
