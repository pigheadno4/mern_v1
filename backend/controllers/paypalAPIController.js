import asyncHandler from "../middleware/asyncHandler.js";

const createOrder = asyncHandler(async (req, res) => {
  const accessToken = req.accessToken;
  const url = `${process.env.PAYPAL_BASE}/v2/checkout/orders`;
  const PayPal_Request_Id = crypto.randomUUID();
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
            user_action: "PAY_NOW",
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
  console.log(resp);
  res.json(resp);
  return resp;
});

export { createOrder, captureOrder, getAccessTokenVault, createOrderVaulting };
