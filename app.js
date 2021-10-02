const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const schema = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const app = express();

app.use(bodyParser.json());

app.use(
  "/api",
  graphqlHTTP({
    schema, /// all schema
    rootValue: resolvers,
    /// all resolvers
    graphiql: true, // to get Gui of Graphql
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.oc8zl.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`
  )
  .then((res) =>
    // listen to port 3030   +
    app.listen(3030)
  )
  .catch((e) => {
    console.log(e);
  });
