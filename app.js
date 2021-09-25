const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const app = express();
app.use(
  "/api",
  graphqlHttp({
    schema: null, /// all schema
    rootValue: {}, /// all resolvers
  })
);
app.use(bodyParser.json());
app.listen(3030);
