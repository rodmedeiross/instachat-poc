import "reflect-metadata";

import express, {Express, Request, Response} from "express";
import cors from "cors";
import {createConnection, Equal} from "typeorm";
import {User, ChatMessage, Chat, UserToChat} from "./models/Entities";
import {body} from "express-validator";
import {getUserController} from "./controllers/users-controller";

const winston: any = require("winston");
const expressWinston = require("express-winston");

const connOptions = {
    type: "postgres",
    host: process.env   .POSTGRES_HOST,
    url: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
    entities: [
        User, Chat, ChatMessage, UserToChat
    ],
    synchronize: true,
    logging: true
};
console.log(JSON.stringify(connOptions));

// create typeorm connection
createConnection(connOptions)
    .then(async (connection) => {
        const userRepository = connection.getRepository(User);
        const chatRepository = connection.getRepository(Chat);
        const chatMessagesRepository = connection.getRepository(ChatMessage);
        const userToChatRepository = connection.getRepository(UserToChat);

        const app: Express = express();

        //more options here - https://github.com/bithavoc/express-winston#request-logging
        app.use(
            expressWinston.logger({
                transports: [new winston.transports.Console()],
                format: winston.format.combine(winston.format.json()),
                meta: false,
                msg: "HTTP  ",
                expressFormat: true,
                colorize: false,
                ignoreRoute: function (req, res) {
                    return false;
                },
            })
        );

        app.use(express.json());
        app.use(cors());

        app.get("/users", async (req: Request, res: Response) => {
            const users = await userRepository.find();
            res.json(users);
        });

        app.get("/users/:id", async function (req: Request, res: Response) {
            const results = await userRepository.findOne(req.params.id);
            return res.send(results);
        });

        app.delete("/users/:id", async function (req: Request, res: Response) {
            const results = await userRepository.delete(req.params.id);
            return res.send(results);
        });

        app.post(
            "/users/:userId/chats",
            async function (req: Request, res: Response) {

                const userNames = req.params.userNames || [];

                const userIds = [...new Set([...req.body.userIds, req.params.userId])];

                let userToChatIds: { chat: Chat, user: User }[] = [];
                const users: User[] = [];
                for (let i = 0; i < userIds.length; i++) {
                    const usr = await userRepository.findOne(userIds[i]);
                    if(usr) {
                        users.push(usr);
                    }
                }

                let chat = await chatRepository.create({
                    title: req.body.title,
                });
                chat = await chatRepository.save(chat);

                console.log("Chat ID: " + JSON.stringify(chat));

                for (let i = 0; i < userIds.length; i++) {
                    userToChatIds.push({
                        chat: chat,
                        user: users[i],
                    });
                }

                userToChatIds = await userToChatRepository.save(userToChatIds);

                return res.send({chat, userToChatIds});
            }
        );

        app.get("/users/:userId/chats", async (req: Request, res: Response) => {
            const usersWithChats = await userToChatRepository.find({
                userId: Equal(req.params.userId),
            });

            console.log(usersWithChats);
            const chats = [];
            for (let i = 0; i < usersWithChats.length; i++) {
                chats.push(await chatRepository.findOne(usersWithChats[i].chatId));
            }

            const aux = chats.map((x) => ({...x, messages: undefined}));

            res.json(aux);
        });

        app.get("/users/:userId/chats/:chatId", async (req, res) => {
            const chat = await chatRepository.findOne(req.params.chatId);

            chat.messages = await connection
                .createQueryBuilder()
                .relation(Chat, "messages")
                .of(chat) // you can use just post id as well
                .loadMany();

            res.json(chat);
        });

        app.put("/users/:userId/chats/:chatId", async (req, res) => {
            const {text} = req.body;
            const {userId, chatId} = req.params;

            let chat = await chatRepository.findOne(chatId);
            let user = await userRepository.findOne(userId);

            let chatMessage = await chatMessagesRepository.create({
                text,
                chat,
                fromUser: user,
                timestamp: new Date().toUTCString(),
            });

            chatMessage = await chatMessagesRepository.save(chatMessage);

            res.json(chatMessage);
        });


        const usersController = getUserController(connection);

        const usersRoute = express.Router();
        usersRoute.post(
            "/login",
            body("email").isEmail(),
            body("password").isLength({min: 3, max: 20}),
            usersController.login
        );
        usersRoute.post(
            "/signup",
            body("email").isEmail(),
            body("password").isLength({min: 3, max: 20}),
            body("name").isLength({min: 3, max: 12}),
            usersController.signup
        );
        usersRoute.put(
            "/edit",
            body("username").isLength({min: 3, max: 12}),
            usersController.edit
        );
        usersRoute.post("/guest", usersController.guest);
        usersRoute.post("/verify", usersController.verify);

        app.use('/api/users', usersRoute);

        app.use(function (err, req, res, next) {
            console.error(err.message); // Log error message in our server's console
            if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
            res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
        });

        app.listen(3333, () => {
            console.log("???? Server started in port 3333!");
        });
    })
    .catch((err) => console.log("TypeORM connection error: ", err));
