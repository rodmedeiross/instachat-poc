import "reflect-metadata";

import express, { Express } from "express";
import cors from "cors";
import instachatRoutes from "./routes";

const winston = require("winston");
const expressWinston = require("express-winston");

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
app.use(instachatRoutes);

app.use(function (err, req, res, next) {
  console.error(err.message); // Log error message in our server's console
  if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});

app.listen(3333, () => {
  console.log("🚀 Server started in port 3333!");
});
