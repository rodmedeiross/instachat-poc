import {
  Avatar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Tooltip,
} from "@material-ui/core";
import React from "react";
import { User } from "../../models";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const useStyles = makeStyles({
  container: {
    height: "100%",
    width: "100%",
    background: "#f5f5f5",
    padding: "10px",
    borderRight: "1px lightgray solid",
    display: "flex",
    flexDirection: "column",
  },
  listContainer: {
    flexGrow: 1,
  },
  footer: {
    marginLeft: "auto",
  },
});

interface Props {
  users: User[];
  currentUserId?: string;
  onUserSelect(userId: string): void;
}

export function UserList(props: Props) {
  const { users, onUserSelect, currentUserId } = props || {};

  console.log(users);

  const classes = useStyles();

  return (
    <>
      <div className={classes.container}>
        <div className={classes.listContainer}>
          <List component="nav">
            {users.map((x) => (
              <>
                <ListItem
                  selected={x.id === currentUserId}
                  button
                  alignItems="flex-start"
                  onClick={() => {
                    onUserSelect(x.id);
                  }}
                >
                  <ListItemAvatar>
                    <Avatar alt={x.name} src={x.picture} />
                  </ListItemAvatar>
                  <ListItemText primary={x.name} />
                </ListItem>
                <Divider />
              </>
            ))}
          </List>
        </div>

        <div className={classes.footer}>
          <Tooltip title="Logout">
            <IconButton
              component="span"
              onClick={() => {
                localStorage.clear();
                document.location.reload();
              }}
            >
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </>
  );
}
