import { makeStyles } from "@material-ui/styles";
import React from "react";
import { MessageList } from "react-chat-elements";
import { Message } from "../../models";
import "react-chat-elements/dist/main.css";

const useStyles = makeStyles(() => ({
  container: {
    flexGrow: 1,
  },
}));

interface Props {
  receivedMessage?: Message[];
  sendmessage?: Message[];
}

export function ChatView({ receivedMessage, sendmessage }: Props) {
  const classes = useStyles();
  const [msgs, setMessages] = React.useState<any[]>([]);

  React.useEffect(() => {
    var receivedMessages = formatMessages(receivedMessage, true);
    var sendMessages = formatMessages(sendmessage, false);

    var messages = [...receivedMessages, ...sendMessages].sort((a, b) =>
      !a.date > !b.date ? -1 : 1
    );

    setMessages(messages);

    console.log(messages);
  }, [receivedMessage, sendmessage]);

  return (
    <div className={classes.container}>
      <MessageList lockable={true} toBottomHeight={"100%"} dataSource={msgs} />
    </div>
  );
}

const formatMessages = (msgs?: Message[], isReceived?: boolean): any[] => {
  return (
    msgs?.map((x) => ({
      position: isReceived ? "left" : "right",
      text: x.text,
      title: x.fromUserName,
      date: Date.parse(x.timestamp),
    })) || []
  );
};
