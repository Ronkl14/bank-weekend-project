import mongoose from "mongoose";
import User from "./UserModel.js";

const AccountSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.String,
      ref: "User",
      validate: {
        async validator(value) {
          const user = await User.findOne({ userID: value });
          return user ? true : false;
        },
        message: "User with this userID does not exist",
      },
      required: true,
    },
    cash: {
      type: Number,
      default: 0,
    },
    credit: {
      type: Number,
      default: 0,
      validate: {
        validator: function (value) {
          return value >= 0;
        },
        message: "Not enough credit",
      },
    },
  },
  {
    toJSON: {
      virtuals: true,
      // Hide the _id and the __v field from the frontend
      transform: function (_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      virtuals: true,
      // Hide the _id and the __v field from the frontend
      transform: function (_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export default mongoose.model("Account", AccountSchema);
