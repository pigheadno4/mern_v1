import express from "express";
import { getAccessToken } from "../middleware/getAccessTokenMiddleware.js";
import {
  createOrder,
  captureOrder,
  getAccessTokenVault,
  createOrderVaulting,
  getFastlaneClientToken,
} from "../controllers/paypalAPIController.js";

const router = express.Router();

router.post("/create-paypal-order", getAccessToken, createOrder);
router.post("/capture-paypal-order", getAccessToken, captureOrder);
router.post(
  "/create-paypal-order-vaulting",
  getAccessToken,
  createOrderVaulting
);
router.post("/get-access-token-vault", getAccessTokenVault);
router.post("/get-fastlane-client-token", getFastlaneClientToken);

export default router;
