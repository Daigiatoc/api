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

// Tất cả routes sẽ đi qua /api
app.use("/api", routes);

// Middleware xử lý lỗi cuối
app.use(errorHandler);

const setupSwagger = require("./docs/swagger");
setupSwagger(app);
module.exports = app;
