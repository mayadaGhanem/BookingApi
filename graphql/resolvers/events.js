const Event = require("../..//models/events");
const User = require("../..//models/user");
const { transformEvent } = require("./resolverHelper");

module.exports = {
  events: async () => {
    try {
      const res = await Event.find({});
      return res.map((event) => transformEvent(event));
    } catch (e) {
      console.log(e);
      throw e;
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
      createdEvent = transformEvent(newEvent);
      const userExist = await User.findById("614f9083993de1fcc6c0e319");
      if (!userExist) {
        throw new Error("The User Not Found");
      }
      userExist.createdEvents.push(event);
      await userExist.save();
      return createdEvent;
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
};
