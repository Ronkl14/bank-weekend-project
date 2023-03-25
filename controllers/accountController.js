import asyncHandler from "express-async-handler";
import Account from "../models/AccountModel.js";
import User from "../models/UserModel.js";

//@desc     Get all accounts
//@route    GET /api/v1/accounts
//@access   Public
export const getAllAccounts = asyncHandler(async (req, res, next) => {
  const accounts = await Account.find();
  res.status(200).json({
    success: true,
    data: accounts,
  });
});

//@desc     Create a new accountSender
//@route    POST /api/v1/accounts
//@access   Private
export const createNewAccount = asyncHandler(async (req, res, next) => {
  const accountSender = await Account.create(req.body);
  const user = await User.findOneAndUpdate(
    { userID: accountSender.owner },
    { $push: { accounts: accountSender._id } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: accountSender,
  });
});

//@desc     Update cash or credit values of an accountSender
//@route    PUT /api/v1/accounts/:id
//@access   Private
export const updateCash = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  if (req.body.deposit) {
    const accountSender = await Account.findByIdAndUpdate(
      id,
      {
        $inc: { cash: req.body.deposit },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: accountSender,
    });
  }

  if (req.body.withdraw) {
    const withdraw = req.body.withdraw;
    let accountSender = await Account.findById(id);

    if (accountSender.cash - withdraw < accountSender.credit * -1) {
      res.status(400).json({
        success: false,
        message: "Not enough credit",
      });
    } else {
      accountSender = await Account.findByIdAndUpdate(
        id,
        { $inc: { cash: -withdraw } },
        { new: true }
      );
      res.status(200).json({
        success: true,
        data: accountSender,
      });
    }
  }

  if (req.body.credit) {
    const accountSender = await Account.findByIdAndUpdate(
      id,
      { credit: req.body.credit },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: accountSender,
    });
  }
});

//@desc     Transfer money from an accountSender to another
//@route    PUT /api/v1/accounts/transfer/:id
//@access   Private
export const transferCash = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const amount = req.body.amount;

  let accountSender = await Account.findById(id);

  if (accountSender.cash - amount < accountSender.credit * -1) {
    res.status(400).json({
      success: false,
      message: "Not enough credit",
    });
  } else {
    accountSender = await Account.findByIdAndUpdate(
      id,
      { $inc: { cash: -amount } },
      { new: true }
    );
    const accountGetter = await Account.findByIdAndUpdate(
      req.body.to,
      { $inc: { cash: amount } },
      { new: true }
    );
    res.status(200).json({
      success: true,
      data: [accountSender, accountGetter],
    });
  }
});
