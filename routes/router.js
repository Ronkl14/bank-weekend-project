import express from "express";
import { createNewUser } from "../controllers/userController.js";
import {
  createNewAccount,
  updateCash,
} from "../controllers/accountController.js";

const router = express.Router();

router.route("/users").post(createNewUser);

router.route("/accounts").post(createNewAccount);

router.route("/accounts/:id").put(updateCash);

export default router;
