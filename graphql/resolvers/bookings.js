const Event = require("../..//models/events");
const Booking = require("../../models/booking");
const { transformBooking, transformEvent } = require("./resolverHelper");

module.exports = {
  bookings: async () => {
    try {
      const res = await Booking.find({});
      return res.map((booking) => transformBooking(booking));
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
  bookEvent: async (args) => {
    try {
      const { eventId } = args;
      const eventExist = await Event.findOne({ _id: eventId });
      if (!eventExist) {
        throw new Error("The Event not Exists!");
      }
      const booking = new Booking({
        user: "614f9083993de1fcc6c0e319",
        event: eventId,
      });
      const newBooking = await booking.save();
      return transformBooking(newBooking);
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
  cancelBooking: async (args) => {
    try {
      const { bookingId } = args;
      const bookingExist = await Booking.findOne({ _id: bookingId }).populate(
        "event"
      );
      if (!bookingExist) {
        throw new Error("The Booking not Exists!");
      }
      const event = transformEvent(bookingExist.event);
      await Booking.deleteOne({ _id: bookingId });
      return event;
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
};
