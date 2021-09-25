const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");

const app = express();

app.use(
  "/api",
  graphqlHttp({
    schema: null, /// all schema
    rootValue: {}, /// all resolvers
    graphiql: true, // to get Gui of Graphql 
  })
);

app.use(bodyParser.json());
// listen to port 3030
app.listen(3030);
