import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import AuthRouter from './routes/AuthRoutes';
import EducationRouter from './routes/EducationRoutes';
import PostRouter from './routes/PostRoutes';
import SubscriptionRouter from './routes/SubscriptionRoutes';
import dotenv from "dotenv";
import "express-async-errors";
import bodyParser from "body-parser";
import { errorHandler } from "./middlewares/error";
import path from "path";
import cors from "cors";

dotenv.config();

export const prisma = new PrismaClient();

const app: Express = express();
const port = process.env.PORT || 3000;

async function main() {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());

  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  // API Routes
  app.use("/api/v1/auth", AuthRouter);
  app.use("/api/v1/education", EducationRouter);
  app.use("/api/v1/post", PostRouter)
  app.use("/api/v1/subscription", SubscriptionRouter)


  app.use(errorHandler);

  app.all("*", (req: Request, res: Response) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` })
  })

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  })
}

main()
  .then(async () => {
    await prisma.$connect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })