import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    address_line_1: { type: String, required: true },
    address_line_2: { type: String },
    admin_area_1: { type: String, required: true }, // city
    admin_area_2: { type: String, required: true }, // state
    postal_code: { type: String },
    country_code: { type: String, required: true },
    phone_number: Number,
    name: { given_name: String, surname: String },
    isShipping: { type: Boolean, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);

export default Address;
