const swaggerUi = require("swagger-ui-express");
const swaggereJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.3",
    info: {
      title: "Order System API",
      version: "1.0.0",
      description: "Order System REST API with express",
    },
    servers: [
      {
        url: "/",
        description: "Order System SSAFY PJT",
      },
    ],
  },
  apis: ["./*.js", "./swagger/*.js"],
};

const specs = swaggereJsdoc(options);

module.exports = { swaggerUi, specs };
