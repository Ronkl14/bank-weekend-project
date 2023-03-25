import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";

//@desc     Create a new user
//@route    POST /api/v1/users
//@access   Private
export const createNewUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc     Get user by id
//@route    GET /api/v1/users/:id
//@access   Private
export const getUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.find({ userID: id });

  res.status(200).json({
    success: true,
    data: user,
  });
});
