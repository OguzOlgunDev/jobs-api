require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

// Security packages

const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

// routers import
const authRouter = require("./routers/authRouter");
const jobsRouter = require("./routers/jobsRouter");

// middlewares import
const {
  authonticationMiddleware,
} = require("./middlewares/authonticationMiddleware");

const errorHandlerMiddleware = require("./middlewares/error-handler");
const notFoutnMiddleware = require("./middlewares/not-found");

app.use(express.json());

app.use(helmet());
app.use(cors();
app.use(xss();
app.use(
  rateLimit({
    windowMs: 1000 * 60 * 10,
    max: 200,
  })
);

// db connection
const { connectDb } = require("./db/connectDb");

// router middlewares
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authonticationMiddleware, jobsRouter);

app.use(errorHandlerMiddleware);
app.use(notFoutnMiddleware);

const port = process.env.PORT || 3000;
const startServer = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
