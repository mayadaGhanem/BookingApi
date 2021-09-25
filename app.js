const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const Event = require("./models/events");
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const app = express();
app.use(bodyParser.json());

app.use(
  "/api",
  graphqlHTTP({
    schema: buildSchema(`
    type Event {
      _id: ID!
      title:String!
      description: String!
      price: Float!
      date: String!
    }
    type User {
      _id: ID!
      email: String!
      password:String
    }
    input EventInput {
      title:String!
      description: String!
      price: Float!
      date: String!
    }
    input UserInput {
      email: String!
      password:String!
    }
    type RootQuery {
      events:[Event!]!
      users:[User!]!
    }
    type RootMutation{
      createEvent(eventInput:EventInput):Event!
      createUser(userInput:UserInput):User!
    }
    schema {
      query:RootQuery
      mutation:RootMutation
    }
    `), /// all schema
    rootValue: {
      events: () => {
        return Event.find({})
          .then((res) => {
            return res.map((event) => ({ ...event._doc }));
          })
          .catch((e) => {
            console.log(e, "Error");
            return e;
          });
      },
      users: () => {
        return User.find({})
          .then((res) => {
            return res.map((user) => ({ ...user._doc }));
          })
          .catch((e) => {
            console.log(e, "Error");
            return e;
          });
      },
      createEvent: (args) => {
        let createdEvent;
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
          creator: "614f9083993de1fcc6c0e319",
        });
        return event
          .save()
          .then((res) => {
            createdEvent = { ...res._doc };
            return User.findById("614f9083993de1fcc6c0e319");
          })
          .then((user) => {
            if (!user) {
              throw new Error("The User Not Found");
            }
            user.createdEvents.push(event);
            user.save();
          })
          .then(() => {
            return createdEvent;
          })
          .catch((e) => {
            console.log(e, "Error");
            return e;
          });
      },
      createUser: (args) => {
        User.findOne({ email: args.userInput.email })
          .then((user) => {
            if (user) {
              throw new Error("The User Already Exists");
            }
            return bcrypt.hash(args.userInput.password, 12);
          })
          .then((hashPassword) => {
            const user = new User({
              password: hashPassword,
              email: args.userInput.email,
            });
            return user.save();
          })
          .then((res) => {
            return { ...res._doc, password: null };
          })
          .catch((e) => {
            console.log(e, "Error");
            return e;
          });
      },
    }, /// all resolvers
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
// comments
