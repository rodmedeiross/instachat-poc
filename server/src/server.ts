import "reflect-metadata";

import express, { Express } from "express";
import cors from "cors";
import instachatRoutes from "./routes";

const app: Express = express();

app.use(express.json());
app.use(cors());
app.use(instachatRoutes);
