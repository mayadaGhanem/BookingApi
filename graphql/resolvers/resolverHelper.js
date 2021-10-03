const User = require("../../models/user");
const Event = require("../../models/events");
const { transformDateToISO } = require("../../helper/transformDate");

const transformEvent = (event) => {
  return {
    ...event._doc,
    creator: user.bind(this, event._doc.creator),
    date: transformDateToISO(event._doc.date),
  };
};

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      createdEvents: event.bind(this, user._doc.createdEvents),
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const event = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => transformEvent(event));
  } catch (e) {
    console.log(e);
    throw e;
  }
};
const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  } catch (e) {
    console.log(e);
    throw e;
  }
};
const transformBooking = (booking) => {
  return {
    ...booking._doc,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: transformDateToISO(booking._doc.createdAt),
    updatedAt: transformDateToISO(booking._doc.updatedAt),
  };
};
module.exports = {
  event,
  transformEvent,
  transformBooking,
};
