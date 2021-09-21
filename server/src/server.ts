import "reflect-metadata";

import express, { Express, Request, Response } from "express";
import cors from "cors";
import { createConnection, Equal } from "typeorm";
import { User, ChatMessage, Chat, UserToChat } from "./models/Entities";

const winston: any = require("winston");
const expressWinston = require("express-winston");

// create typeorm connection
createConnection()
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

    app.post("/users", async function (req: Request, res: Response) {
      const user = await userRepository.create(req.body);
      const results = await userRepository.save(user);
      return res.send(results);
    });

    app.put("/users/:id", async function (req: Request, res: Response) {
      const user = await userRepository.findOne(req.params.id);
      userRepository.merge(user, req.body);
      const results = await userRepository.save(user);
      return res.send(results);
    });

    app.delete("/users/:id", async function (req: Request, res: Response) {
      const results = await userRepository.delete(req.params.id);
      return res.send(results);
    });

    app.post(
      "/users/:userId/chats",
      async function (req: Request, res: Response) {
        const userIds = [...new Set([...req.body.userIds, req.params.userId])];

        let userToChatIds = [];
        const users = [];
        for (let i = 0; i < userIds.length; i++) {
          users.push(await userRepository.findOne(userIds[i]));
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

        return res.send({ chat, userToChatIds });
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

      const aux = chats.map((x) => ({ ...x, messages: undefined }));

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
      const { text } = req.body;
      const { userId, chatId } = req.params;

      let chat = await chatRepository.findOne(chatId);
      let user = await userRepository.findOne(userId);

      let chatMessage = await chatMessagesRepository.create({
        text,
        chat,
        fromUser: user,
        timestamp: 0,
      });

      chatMessage = await chatMessagesRepository.save(chatMessage);

      res.json(chatMessage);
    });

    app.use(function (err, req, res, next) {
      console.error(err.message); // Log error message in our server's console
      if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
      res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
    });

    app.listen(3333, () => {
      console.log("🚀 Server started in port 3333!");
    });
  })
  .catch((err) => console.log("TypeORM connection error: ", error));
