import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import {userSignIn, userSignUp} from "../../API";
import {sign} from "crypto";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: "100%",
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignIn() {
    const classes = useStyles();
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const [isSignUp, setIsSignUp] = React.useState(false);

    const validateForm = () => {
        if (isSignUp)
            return email.length > 0 && name.length > 0 && password.length > 0;
        else
            return email.length > 0 && password.length > 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const handleSignIn = async () => {
        const signin = await userSignIn({email, password});
        if (!signin?.access) {
            alert(signin.message);
        }
        if (signin?.access) {
            sessionStorage.setItem("user", JSON.stringify(signin.user));
            sessionStorage.setItem("token", signin.user.token);
            window.location.reload();
        }
    };

    const handleSignUp = async () => {
        const signup = await userSignUp({email, name, password});
        if (signup && !signup.access) {
            alert(signup.message);
        } else {
            await handleSignIn();
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    {isSignUp ? 'Sign up' : 'Sign in'}
                </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {
                        isSignUp &&
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    }
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {isSignUp && <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="secondary"
                        onClick={async (e) => {
                            e.preventDefault();
                            await handleSignUp();
                        }}
                        className={classes.submit}
                        disabled={!validateForm()}
                    >
                        Sign Up
                    </Button>}
                    {!isSignUp &&
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={async (e) => {
                            e.preventDefault();
                            await handleSignIn();
                        }}
                        className={classes.submit}
                        disabled={!validateForm()}
                    >
                        Sign In
                    </Button>
                    }

                    <Grid container>
                        <Grid item style={{textAlign: "center"}}>
                            <Link href="#" variant="body2" onClick={() => setIsSignUp(!isSignUp)}>
                                {!isSignUp && "Don't have an account? Sign Up"}
                                {isSignUp && "Have an account? Sign In"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}
