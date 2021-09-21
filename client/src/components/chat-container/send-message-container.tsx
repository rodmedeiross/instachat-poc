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
  onSendMessage: (message: string) => void;
}

export function SendMessageContainer(props: Props) {
  const classes = useStyles();
  const { onSendMessage } = props || {};
  const [currentMessage, setCurrentMessage] = React.useState<string>("");

  const handleSubmit = () => {
    setCurrentMessage("");
    onSendMessage(currentMessage);
  };

  return (
    <div className={classes.container}>
      <FormControl style={{ flexGrow: 1 }} variant="outlined">
        <OutlinedInput
          multiline
          rows={3}
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key == "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
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
