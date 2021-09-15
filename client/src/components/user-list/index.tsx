import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import React from "react";
import { User } from "../../models";

const useStyles = makeStyles({
  container: {
    height: "100%",
    width: "100%",
    background: "#f5f5f5",
    padding: "10px",
    borderRight: "1px lightgray solid",
  },
});

interface Props {
  users: User[];
}

export function UserList(props: Props) {
  const { users } = props || {};

  console.log(users);

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <List component="nav">
        {users.map((x) => (
          <>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt={x.name} src={x.picture} />
              </ListItemAvatar>
              <ListItemText
                primary={x.name}
                secondary={<React.Fragment>{x.lastMessage}</React.Fragment>}
              />
            </ListItem>
            <Divider />
          </>
        ))}
      </List>
    </div>
  );
}
