import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import AppError from "./src/middleware/AppError.js";
import seedDatabase from "./src/config/initialData.js";
import connectDB from "./src/config/connectDB.js";
import userRoutes from "./src/routes/userRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import cardRoutes from "./src/routes/cardRoutes.js";
import errorMiddleware from "./src/middleware/errorMiddleware.js";
import printMessage from "./src/utils/printMessage.js";

dotenv.config();

const { default: config } = await import("config");

connectDB();
seedDatabase();

const app = express();

app.use(morgan(":date[iso] | :method | :url | :status | :response-time ms"));
app.use(express.json());
app.use(express.static("public"));

const allowedOrigins = config.get("corsOrigins");

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    allowedHeaders: "Content-Type, Accept, Authorization",
  }),
);

app.use("/users", userRoutes);
app.use("/users", authRoutes);
app.use("/cards", cardRoutes);

app.get("/", (req, res) => {
  res.send({
    message: "WELLCOME TO MY BUSINESS CARD PROJECT",
  });
});

app.use((req, res, next) => {
  next(new AppError("Route not found", 404));
});

app.use(errorMiddleware);

const port = config.get("port");

app.listen(port, () => {
  printMessage(`listening on port ${port}`, "success");
});
