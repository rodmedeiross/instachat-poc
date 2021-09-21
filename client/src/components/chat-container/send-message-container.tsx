import {
  FormControl,
  IconButton,
  InputAdornment,
  makeStyles,
  OutlinedInput,
} from "@material-ui/core";
import React from "react";
import SendIcon from "@material-ui/icons/Send";
import { sendMessage } from "../../API";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "row",
  },
}));

interface Props {
  chatId: string;
  userId: string;
}

export function SendMessageContainer(props: Props) {
  const classes = useStyles();
  const { chatId, userId } = props || {};
  const [currentMessage, setCurrentMessage] = React.useState<string>("");

  const handleSubmit = async () => {
    setCurrentMessage("");

    await sendMessage({
      chatId,
      userId,
      message: currentMessage,
    });
  };

  return (
    <div className={classes.container}>
      <FormControl style={{ flexGrow: 1 }} variant="outlined">
        <OutlinedInput
          multiline
          rows={3}
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleSubmit}>
                <SendIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    </div>
  );
}
