const Event = require("../..//models/events");
const User = require("../..//models/user");
const bcrypt = require("bcryptjs");
const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      createdEvents: event.bind(this, user._doc.createdEvents),
    };
  } catch (e) {
    console.log(e);
  }
};
const event = async (eventIds) => {
  try {
    const events = await Event.find({ createdEvents: { $in: eventIds } });
    return events.map((event) => ({
      ...event._doc,
      creator: user.bind(this, event._doc.creator),
      date: new Date(event._doc.date).toISOString(),
    }));
  } catch (e) {
    console.log(e);
  }
};
const resolvers = {
  events: async () => {
    try {
      const res = await Event.find({});
      return res.map((event) => ({
        ...event._doc,
        creator: user.bind(this, event._doc.creator),
      }));
    } catch (e) {
      console.log(e);
    }
  },
  users: async () => {
    try {
      const res = await User.find({});
      return res.map((user) => ({ ...user._doc }));
    } catch (e) {
      console.log(e);
    }
  },
  createEvent: async (args) => {
    try {
      let createdEvent;
      let event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: "614f9083993de1fcc6c0e319",
      });
      const newEvent = await event.save();
      createdEvent = {
        ...newEvent._doc,
        date: new Date(newEvent._doc.date).toISOString(),
        creator: user.bind(this, newEvent._doc.creator),
      };
      const userExist = await User.findById("614f9083993de1fcc6c0e319");

      if (!userExist) {
        throw new Error("The User Not Found");
      }
      userExist.createdEvents.push(event);
      await userExist.save();
      return createdEvent;
    } catch (e) {
      console.log(e);
    }
  },
  createUser: async (args) => {
    try {
      const userExist = await User.findOne({ email: args.userInput.email });
      if (userExist) {
        throw new Error("The User Already Exists");
      }
      const hashPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        password: hashPassword,
        email: args.userInput.email,
      });
      const newUser = await user.save();
      return {
        ...newUser._doc,
        password: null,
        createdEvents: event.bind(this, newUser._doc.createdEvents),
      };
    } catch (e) {
      console.log(e);
    }
  },
};
module.exports = resolvers;
