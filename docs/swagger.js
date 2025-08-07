const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const schemas = require("./swaggerSchemas"); // import schemas
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.API_URL || "http://localhost";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Đại Gia Tộc API",
      version: "1.0.0",
      description: "Tài liệu API cho hệ thống user + auth",
    },
    servers: [
      {
        url: `${HOST}:${PORT}/api`,
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: schemas, // 👈 Gắn schemas đã import
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
