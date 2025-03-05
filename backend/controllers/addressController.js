import Address from "../models/addressModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc    Create new address
// @route   POST /api/addresses
// @access  Private
const createAddress = asyncHandler(async (req, res) => {
  const {
    address_line_1,
    address_line_2,
    admin_area_1,
    admin_area_2,
    postal_code,
    country_code,
    phone_number,
    name,
    isShipping,
  } = req.body;
  const address = new Address({
    user: req.user._id,
    address_line_1,
    address_line_2,
    admin_area_1,
    admin_area_2,
    postal_code,
    country_code,
    phone_number,
    name,
    isShipping,
  });

  const createdAddress = await address.save();

  res.status(201).json(createdAddress);
});

// @desc    Fetch all addresses by Type
// @route   GET /api/addresses/billing (shipping or billing)
// @access  Private
const getMyBillingAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({
    user: req.user._id,
    isShipping: false,
  });

  res.status(200).json(addresses);
});

// @desc    Fetch all addresses by Type
// @route   GET /api/addresses/shipping (shipping or billing)
// @access  Private
const getShippingAddresses = asyncHandler(async (req, res) => {
  console.log("get shipping addresses", req.user._id);
  const addresses = await Address.find({
    user: req.user._id,
    isShipping: true,
  });
  // console.log(addresses);
  res.status(200).json(addresses);
});

// @desc    Fetch all addresses
// @route   GET /api/addresses
// @access  Private

const getAllMyAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id });

  // if (addresses) {
  //   res.status(404);
  //   throw new Error('Addresses not found');
  // }
  res.status(200).json(addresses);
});

// @desc    Fetch a address by Id
// @route   GET /api/addresses/:id
// @access  Private
const getAddressById = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (address) {
    res.status(200).json(address);
  } else {
    res.status(404);
    throw new Error("Address not found");
  }
});

// @desc    Delete a address
// @route   DELETE /api/addresses/:id
// @access  Private
const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (address) {
    await Address.deleteOne({ _id: address._id });
    res.status(200).json({ message: "Address deleted" });
  } else {
    res.status(404);
    throw new Error("Address not found");
  }
});

// @desc    Update a address
// @route   PUT /api/addresses/:id
// @access  Private
const updateAddress = asyncHandler(async (req, res) => {
  console.log("updateAddress");
  console.log(req.params.id);
  console.log(req.body);
  const address = await Address.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  console.log(address);
  if (!address) {
    res.status(404);
    throw new Error("Failed to update address, no address with that ID");
  }
  res.status(200).json(address);
});

// @desc    Set a shipping address to Default
// @route   PUT /api/addresses/:id/shippingdefault
// @access  Private
const setShippingAddressToDefault = asyncHandler(async (req, res) => {
  const currentDefaultAddress = await Address.findOne({
    user: req.user._id,
    isShipping: true,
    isDefault: true,
  });
  const newDefaultAddress = await Address.findByIdAndUpdate(
    req.params.id,
    { isDefault: true },
    { new: true, runValidators: true }
  );

  if (!newDefaultAddress) {
    res.status(404);
    throw new Error("Failed to set this shipping address as default!");
  }

  await Address.findByIdAndUpdate(currentDefaultAddress._id, {
    isDefault: false,
  });

  res.status(200).json(newDefaultAddress);
});

// @desc    Set a billing address to Default
// @route   PUT /api/addresses/:id/billingdefault
// @access  Private
const setBillingAddressToDefault = asyncHandler(async (req, res) => {
  const currentDefaultAddress = await Address.findOne({
    user: req.user._id,
    isShipping: false,
    isDefault: true,
  });
  console.log("current: ", currentDefaultAddress);
  const newDefaultAddress = await Address.findByIdAndUpdate(
    req.params.id,
    { isDefault: true }
    // { new: true }
  );
  console.log("new: ", newDefaultAddress);
  if (!newDefaultAddress) {
    res.status(404);
    throw new Error("Failed to set this billing address as default!");
  }

  await Address.findByIdAndUpdate(currentDefaultAddress._id, {
    isDefault: false,
  });

  res.status(200).json(newDefaultAddress);
});

// @desc    Get a default shipping address
// @route   GET /api/addresses/shippingdefault
// @access  Private
const getDefaultShipping = asyncHandler(async (req, res) => {
  const defaultShippingAddress = await Address.findOne({
    user: req.user._id,
    isShipping: true,
    isDefault: true,
  });

  res.status(200).json(defaultShippingAddress);
});

// @desc    Get a default billing address
// @route   GET /api/addresses/billingdefault
// @access  Private
const getDefaultBilling = asyncHandler(async (req, res) => {
  const defaultShippingAddress = await Address.findOne({
    user: req.user._id,
    isShipping: false,
    isDefault: true,
  });

  res.status(200).json(defaultShippingAddress);
});

export {
  createAddress,
  getMyBillingAddresses,
  getShippingAddresses,
  getAllMyAddresses,
  getAddressById,
  deleteAddress,
  updateAddress,
  setShippingAddressToDefault,
  setBillingAddressToDefault,
  getDefaultBilling,
  getDefaultShipping,
};
