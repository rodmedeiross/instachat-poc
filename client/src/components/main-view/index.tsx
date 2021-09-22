import React, {useState} from "react";
import {makeStyles} from "@material-ui/styles";
import {ChatHeader} from "../chat-header";
import {ChatContainer} from "../chat-container";
import {UserList} from "../user-list";
import {Typography} from "@material-ui/core";
import {getChats, getDetailChats} from "../../API";
import {getUsers} from "../../API";

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

    const user = JSON.parse(sessionStorage.getItem("user") || '{ "id": "guest" }');
    const currentUserId = user.id;

    const [chats, setChats] = React.useState<any>([]);
    const [users, setUsers] = React.useState<any>([]);
    const [currentChatId, setCurrentChat] = useState<string>();


    const setup = async () => {
        try {
            const receivedUsers = await getUsers();
            setUsers(receivedUsers);
            setChats(await getChats({userId: receivedUsers[0].id}));
        } catch (e) {
            alert("Error");
        }
    };

    React.useEffect(() => {
        (async () => await setup())();
    }, []);

    const handleCurrentGroup = (chatId: string) => {
        setCurrentChat(chatId);
    };

    const chat = chats.find((x: any) => x.id === currentChatId);

    return (
        <div className={classes.container}>
            <div className={classes.list}>
                <UserList
                    chats={chats}
                    onGroupSelect={handleCurrentGroup}
                    currentUserId={currentUserId}
                    currentGroupId={currentChatId}
                    onGroupCreated={() => {
                        (async () => await setup())();
                    }}
                />
            </div>
            {currentUserId && currentChatId ? (
                <>
                    <div className={classes.userheader}>
                        <ChatHeader chat={chat}/>
                    </div>
                    <div className={classes.chatContainer}>
                        <ChatContainer users={users} userId={currentUserId} chatId={currentChatId}/>
                    </div>
                </>
            ) : (
                <NoContent/>
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
