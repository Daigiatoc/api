const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const routes = require("./routes");
const { errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api", routes);

// Middleware xử lý lỗi
app.use(errorHandler);

module.exports = app;
