import express from "express";
import { getAccessToken } from "../middleware/getAccessTokenMiddleware.js";
import {
  createOrder,
  captureOrder,
  getAccessTokenVault,
} from "../controllers/paypalAPIController.js";

const router = express.Router();

router.post("/create-paypal-order", getAccessToken, createOrder);
router.post("/capture-paypal-order", getAccessToken, captureOrder);
router.post("/get-access-token-vault", getAccessTokenVault);

export default router;
