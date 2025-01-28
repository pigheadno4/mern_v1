import express from "express";
import { getAccessToken } from "../middleware/getAccessTokenMiddleware.js";
import {
  createOrder,
  captureOrder,
} from "../controllers/paypalAPIController.js";

const router = express.Router();

router.post("/create-paypal-order", getAccessToken, createOrder);
router.post("/capture-paypal-order", getAccessToken, captureOrder);

export default router;
