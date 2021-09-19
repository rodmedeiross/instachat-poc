import {
  FormControl,
  IconButton,
  InputAdornment,
  makeStyles,
  OutlinedInput,
} from "@material-ui/core";
import React from "react";
import SendIcon from "@material-ui/icons/Send";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "row",
  },
}));

export function SendMessageContainer() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <FormControl style={{ flexGrow: 1 }} variant="outlined">
        <OutlinedInput
          multiline
          rows={3}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={() => {}} onMouseDown={() => {}}>
                <SendIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    </div>
  );
}
