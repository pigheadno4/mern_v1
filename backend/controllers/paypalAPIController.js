import asyncHandler from "../middleware/asyncHandler.js";
import path from "path";

const createOrder = asyncHandler(async (req, res) => {
  const accessToken = req.accessToken;
  // const __dirname = path.resolve();
  // const callbackUrl = path.join(__dirname, "/api/paypal/get-shipping-update");
  // console.log("callback url: ", callbackUrl);
  const url = `${process.env.PAYPAL_BASE}/v2/checkout/orders`;
  const PayPal_Request_Id = crypto.randomUUID();
  console.log("create normal order");
  //   console.log(url);
  //   console.log(accessToken);
  // console.log("PayPal Create Order Request Body: ", req.body);
  const items = req.body.order.orderItems.map((x, index) => ({
    name: x.name,
    // sku: x.brand,
    // description: x.description,
    quantity: x.qty,
    unit_amount: {
      currency_code: "USD",
      value: x.price,
    },
  }));
  // console.log(req.body.order.orderItems);
  // console.log(items);
  // console.log("billing : ", req.body.order.billingAddress);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "PayPal-Request-Id": PayPal_Request_Id,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      payment_source: {
        paypal: {
          experience_context: {
            brand_name: "Pig Head No4 Intl Store",
            shipping_preference: "GET_FROM_FILE",
            user_action: "PAY_NOW",
            return_url: "https://example.com/returnUrl",
            cancel_url: "https://example.com/cancelUrl",
            order_update_callback_config: {
              callback_events: ["SHIPPING_ADDRESS", "SHIPPING_OPTIONS"],
              callback_url:
                "https://mern-v1.onrender.com/api/paypal/get-shipping-update",
            },
            // app_switch_preference: {
            //   launch_paypal_app: true,
            // },
          },
          email_address: req.body.order.user.email,
          name: req.body.order.billingAddress.name,
          address: {
            address_line_1: req.body.order.billingAddress.address_line_1,
            address_line_2: req.body.order.billingAddress.address_line_2,
            admin_area_2: req.body.order.billingAddress.admin_area_2,
            admin_area_1: req.body.order.billingAddress.admin_area_1,
            postal_code: req.body.order.billingAddress.postal_code,
            country_code: req.body.order.billingAddress.country_code,
          },
          phone: {
            phone_type: "MOBILE",
            phone_number: {
              national_number: req.body.order.billingAddress.phone_number,
            },
          },
        },
      },
      purchase_units: [
        {
          reference_id: req.body.order._id,
          description: "Demo site purchase",
          invoice_id: PayPal_Request_Id,
          custom_id: "TestNumber000001",
          amount: {
            currency_code: "USD",
            value: req.body.order.totalPrice,
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: req.body.order.itemsPrice,
              },
              shipping: {
                currency_code: "USD",
                value: req.body.order.shippingPrice,
              },
              tax_total: {
                currency_code: "USD",
                value: req.body.order.taxPrice,
              },
            },
          },
          items: items,
          shipping: {
            options: [
              {
                id: "001",
                label: "UPS",
                selected: true,
                type: "SHIPPING",
                amount: {
                  currency_code: "USD",
                  value: "0.00",
                },
              },
              {
                id: "002",
                label: "FEDEX",
                selected: false,
                type: "SHIPPING",
                amount: {
                  currency_code: "USD",
                  value: "3.00",
                },
              },
            ],
            name: {
              full_name: req.body.order.shippingAddress.name.surname,
            },
            address: {
              address_line_1: req.body.order.shippingAddress.address_line_1,
              address_line_2: req.body.order.shippingAddress.address_line_2,
              admin_area_2: req.body.order.shippingAddress.admin_area_2,
              admin_area_1: req.body.order.shippingAddress.admin_area_1,
              postal_code: req.body.order.shippingAddress.postal_code,
              country_code: req.body.order.shippingAddress.country_code,
            },
          },
        },
      ],
    }),
  });
  const resp = await response.json();
  console.log(resp);
  res.json(resp);
  return resp;
});

const captureOrder = asyncHandler(async (req, res) => {
  console.log("Capture Order");
  const accessToken = req.accessToken;
  const orderId = req.body.orderID;
  //   console.log(req.body);
  const url = `${process.env.PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const resp = await response.json();
  console.log("Order Capture: ", resp);
  res.json(resp);
});

const getAccessTokenVault = asyncHandler(async (req, res) => {
  const params = {
    grant_type: "client_credentials",
    response_type: "id_token",
    ...req.body,
  };
  console.log("access userinfo.customer_id: ", req);
  // pass the url encoded value as the body of the post call
  const urlEncodedParams = new URLSearchParams(params).toString();

  const auth = Buffer.from(
    process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET
  ).toString("base64");
  const response = await fetch(`${process.env.PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
    },
    body: urlEncodedParams,
  });
  const jsonData = await response.json();
  req.accessToken = jsonData.access_token;

  // console.log(response.body);
  res.status(200).json(jsonData);
});

// create order for vaulting

const createOrderVaulting = asyncHandler(async (req, res) => {
  const accessToken = req.accessToken;
  const url = `${process.env.PAYPAL_BASE}/v2/checkout/orders`;
  const PayPal_Request_Id = crypto.randomUUID();
  console.log("create vaulting order");
  //   console.log(PayPal_Request_Id);
  //   console.log(url);
  //   console.log(accessToken);
  // console.log("PayPal Create Order Request Body: ", req.body);
  const items = req.body.order.orderItems.map((x, index) => ({
    name: x.name,
    // sku: x.brand,
    // description: x.description,
    quantity: x.qty,
    unit_amount: {
      currency_code: "USD",
      value: x.price,
    },
  }));
  // console.log(req.body.order.orderItems);
  // console.log(items);
  // console.log("billing : ", req.body.order.billingAddress);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "PayPal-Request-Id": PayPal_Request_Id,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      payment_source: {
        paypal: {
          experience_context: {
            brand_name: "Pig Head No4 Intl Store",
            shipping_preference: "SET_PROVIDED_ADDRESS",
            // user_action: "PAY_NOW",
            return_url: "https://example.com/returnUrl",
            cancel_url: "https://example.com/cancelUrl",
          },
          email_address: req.body.order.user.email,
          name: req.body.order.billingAddress.name,
          address: {
            address_line_1: req.body.order.billingAddress.address_line_1,
            address_line_2: req.body.order.billingAddress.address_line_2,
            admin_area_2: req.body.order.billingAddress.admin_area_2,
            admin_area_1: req.body.order.billingAddress.admin_area_1,
            postal_code: req.body.order.billingAddress.postal_code,
            country_code: req.body.order.billingAddress.country_code,
          },
          phone: {
            phone_type: "MOBILE",
            phone_number: {
              national_number: req.body.order.billingAddress.phone_number,
            },
          },
          attributes: {
            vault: {
              store_in_vault: "ON_SUCCESS",
              usage_type: "MERCHANT",
              customer_type: "CONSUMER",
            },
          },
        },
      },
      purchase_units: [
        {
          reference_id: req.body.order._id,
          description: "Demo site purchase",
          invoice_id: PayPal_Request_Id,
          custom_id: "TestNumber000001",
          amount: {
            currency_code: "USD",
            value: req.body.order.totalPrice,
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: req.body.order.itemsPrice,
              },
              shipping: {
                currency_code: "USD",
                value: req.body.order.shippingPrice,
              },
              tax_total: {
                currency_code: "USD",
                value: req.body.order.taxPrice,
              },
            },
          },
          items: items,
          shipping: {
            name: {
              full_name: req.body.order.shippingAddress.name.surname,
            },
            address: {
              address_line_1: req.body.order.shippingAddress.address_line_1,
              address_line_2: req.body.order.shippingAddress.address_line_2,
              admin_area_2: req.body.order.shippingAddress.admin_area_2,
              admin_area_1: req.body.order.shippingAddress.admin_area_1,
              postal_code: req.body.order.shippingAddress.postal_code,
              country_code: req.body.order.shippingAddress.country_code,
            },
          },
        },
      ],
    }),
  });
  const resp = await response.json();
  // console.log(resp);
  res.json(resp);
  return resp;
});

// fastlane access token
const getFastlaneClientToken = asyncHandler(async (req, res) => {
  try {
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_SECRET) {
      throw new Error("Missing API credentials");
    }

    const url = `${process.env.PAYPAL_BASE}/v1/oauth2/token`;

    const headers = new Headers();

    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString("base64");

    headers.append("Authorization", `Basic ${auth}`);
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    const searchParams = new URLSearchParams();
    searchParams.append("grant_type", "client_credentials");
    searchParams.append("response_type", "client_token");
    searchParams.append("intent", "sdk_init");
    searchParams.append("domains[]", "mern-v1.onrender.com");

    const options = {
      method: "POST",
      headers,
      body: searchParams,
    };

    const response = await fetch(url, options);
    const data = await response.json();
    res.status(200).json(data);
    return data.access_token;
  } catch (error) {
    console.error(error);

    return "";
  }
});

// shipping callback
const getShippingInfo = asyncHandler(async (req, res) => {
  console.log(req.body);
  res.status(200);
});

export {
  createOrder,
  captureOrder,
  getAccessTokenVault,
  createOrderVaulting,
  getFastlaneClientToken,
  getShippingInfo,
};
