import express from "express";

import {
  createAddress,
  getShippingAddresses,
  getMyBillingAddresses,
  getAllMyAddresses,
  getAddressById,
  deleteAddress,
  updateAddress,
  setBillingAddressToDefault,
  setShippingAddressToDefault,
  getDefaultBilling,
  getDefaultShipping,
} from "../controllers/addressController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
router.route("/").get(protect, getAllMyAddresses).post(protect, createAddress);
router.route("/shipping").get(protect, getShippingAddresses);
router.get("/billing", protect, getMyBillingAddresses);
router.get("/defaultbilling", protect, getDefaultBilling);
router.get("/defaultshipping", protect, getDefaultShipping);
router
  .route("/:id")
  .get(protect, getAddressById)
  .patch(protect, updateAddress)
  .delete(protect, deleteAddress);
router
  .route("/:id/shippingdefault")
  .patch(protect, setShippingAddressToDefault);
router.route("/:id/billingdefault").patch(protect, setBillingAddressToDefault);
export default router;
