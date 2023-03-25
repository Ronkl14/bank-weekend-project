import express from "express";
import { createNewUser, getUser } from "../controllers/userController.js";
import {
  createNewAccount,
  updateCash,
  transferCash,
  getAllAccounts,
} from "../controllers/accountController.js";

const router = express.Router();

router.route("/users").post(createNewUser);

router.route("/users/:id").get(getUser);

router.route("/accounts").post(createNewAccount).get(getAllAccounts);

router.route("/accounts/:id").put(updateCash);

router.route("/accounts/transfer/:id").put(transferCash);

export default router;
