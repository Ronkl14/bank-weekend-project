import asyncHandler from "express-async-handler";
import Account from "../models/AccountModel.js";
import User from "../models/UserModel.js";

//@desc     Create a new account
//@route    POST /api/v1/accounts
//@access   Private
export const createNewAccount = asyncHandler(async (req, res, next) => {
  const account = await Account.create(req.body);
  const user = await User.findOneAndUpdate(
    { userID: account.owner },
    { $push: { accounts: account._id } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: account,
  });
});
