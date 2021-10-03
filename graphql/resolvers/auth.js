const User = require("../..//models/user");
const bcrypt = require("bcryptjs");
const { event } = require("./resolverHelper");

module.exports = {
  users: async () => {
    try {
      const res = await User.find({});
      return res.map((user) => ({ ...user._doc }));
    } catch (e) {
      console.log(e);
      throw e;
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
      throw e;
    }
  },
};
