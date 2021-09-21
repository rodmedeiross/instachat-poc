import { Router } from "express";
import messageRouter from "./messages.routes";

const routes: Router = Router();
routes.use(messageRouter);

export default routes;
