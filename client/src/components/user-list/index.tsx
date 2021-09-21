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
  currentGroupId?: string;
  onGroupSelect(userId: string): void;
  chats: {
    id: string;
    title: string;
    lastMessage?: string;
  }[];
}

export function UserList(props: Props) {
  const { onGroupSelect, currentGroupId, chats } = props || {};
  const classes = useStyles();

  console.log(chats);

  return (
    <>
      <div className={classes.container}>
        <div className={classes.listContainer}>
          <List component="nav">
            {chats.map((x) => (
              <div key={x.id}>
                <ListItem
                  selected={x.id === currentGroupId}
                  button
                  alignItems="flex-start"
                  onClick={() => {
                    onGroupSelect(x.id);
                  }}
                >
                  <ListItemAvatar>
                    <Avatar alt={x.title} />
                  </ListItemAvatar>
                  <ListItemText primary={x.title} />
                </ListItem>
                <Divider />
              </div>
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
