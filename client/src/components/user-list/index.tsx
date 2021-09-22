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
import {GroupAdd} from "@material-ui/icons";
import {createGroup, getUsers} from "../../API";

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
    currentUserId: string;

    onGroupSelect(userId: string): void;
    onGroupCreated():void;

    chats: {
        id: string;
        title: string;
        lastMessage?: string;
    }[];
}

export function UserList(props: Props) {
    const {onGroupSelect, currentGroupId, currentUserId, chats, onGroupCreated} = props || {};
    const classes = useStyles();

    const [users, setUsers] = React.useState<{id: string, name: string, email: string}[]>([]);
    React.useEffect(() => {
        (async () => {
            setUsers(await getUsers());
        })();
    }, []);

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
                                        <Avatar alt={x.title}/>
                                    </ListItemAvatar>
                                    <ListItemText primary={x.title}/>
                                </ListItem>
                                <Divider/>
                            </div>
                        ))}
                    </List>
                </div>

                <div className={classes.footer}>
                    <Tooltip title="Create Group">
                        <IconButton
                            component="span"
                            onClick={async () => {
                                const groupName = prompt('Group Name')|| 'Grupo';
                                const userEmail = prompt('User Email');

                                const userId1 = users.filter(x => x.email == userEmail)[0]?.id;

                                if(groupName && userId1) {

                                    await createGroup({
                                        fromUserId: currentUserId,
                                        title:  groupName,
                                        userIds: [userId1]
                                    });
                                }

                                onGroupCreated();
                            }}
                        >
                            <GroupAdd/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Logout">
                        <IconButton
                            component="span"
                            onClick={() => {
                                sessionStorage.clear();
                                document.location.reload();
                            }}
                        >
                            <ExitToAppIcon/>
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
        </>
    );
}
