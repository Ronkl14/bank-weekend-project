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

//@desc     Update cash value of an account
//@route    PUT /api/v1/accounts/:id
//@access   Private
export const updateCash = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  if (req.body.deposit) {
    const account = await Account.findByIdAndUpdate(
      id,
      {
        $inc: { cash: req.body.deposit },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: account,
    });
  }

  if (req.body.withdraw) {
    const withdraw = req.body.withdraw;
    let account = await Account.findById(id);

    if (account.cash - withdraw < account.credit * -1) {
      res.status(400).json({
        success: false,
        message: "Not enough credit",
      });
    } else {
      account = await Account.findByIdAndUpdate(
        id,
        { $inc: { cash: -withdraw } },
        { new: true }
      );
      res.status(200).json({
        success: true,
        data: account,
      });
    }
  }
});
