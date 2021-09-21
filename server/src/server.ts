import "reflect-metadata";

import express, { Express, Request, Response } from "express";
import cors from "cors";
import { createConnection } from "typeorm";
import { User, ChatMessage, Chat } from "./models/Entities";

const winston = require("winston");
const expressWinston = require("express-winston");

// create typeorm connection
createConnection()
  .then(async (connection) => {
    const userRepository = connection.getRepository(User);
    const chatRepository = connection.getRepository(Chat);
    const chatMessagesRepository = connection.getRepository(ChatMessage);

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

        const users = [];
        for (let i = 0; i < userIds.length; i++) {
          users.push(await userRepository.findOne(userIds[i]));
        }

        console.log(users);
        const chat = await chatRepository.create({
          users,
          messages: [],
          title: req.body.title,
        });

        return res.send(chat);
      }
    );

    app.get("/users/:userId/chats", async (req: Request, res: Response) => {
      const user = await chatRepository.findOne({
        id: req.params.userId,
        // relations: ["chats"],
      });

      const aux = user.chats.map((x) => ({ ...x, messages: undefined }));

      res.json(aux);
    });

    app.get("/users/:userId/chats/:chatId", (req, res) => {
      const userId = req.params.userId;
      const chatId = req.params.chatId;
      res.json(chats.find((x) => x.id == chatId));
    });

    app.put("/users/:userId/chats/:chatId", (req, res) => {
      const { userId, chatId } = req.params;
      const chat = chats.find((x) => x.id == chatId);
      const { message } = req.body;
      const { users } = chat || {};
      chat?.messages.push({
        text: message,
        messageId: "s", //TODO generate id
        chatId: chatId,
        timestamp: Date.now(),
        from: userId,
      });
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
