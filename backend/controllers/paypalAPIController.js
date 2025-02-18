import asyncHandler from "../middleware/asyncHandler.js";

const createOrder = asyncHandler(async (req, res) => {
  const accessToken = req.accessToken;
  const url = `${process.env.PAYPAL_BASE}/v2/checkout/orders`;
  const PayPal_Request_Id = crypto.randomUUID();
  //   console.log(PayPal_Request_Id);
  //   console.log(url);
  //   console.log(accessToken);
  console.log(req.body);
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
  console.log(req.body.order.orderItems);
  console.log(items);

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
          name: {
            given_name: req.body.order.user.name,
            surname: req.body.order.user.name,
          },
          address: {
            address_line_1: req.body.order.shippingAddress.address,
            address_line_2: "",
            admin_area_2: req.body.order.shippingAddress.city,
            admin_area_1: "DC",
            postal_code: req.body.order.shippingAddress.postalCode,
            country_code: "US",
          },
          phone: {
            phone_type: "MOBILE",
            phone_number: {
              national_number: "1429876354",
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
              full_name: req.body.order.user.name,
            },
            address: {
              address_line_1: req.body.order.shippingAddress.address,
              address_line_2: "",
              admin_area_2: req.body.order.shippingAddress.city,
              admin_area_1: "DC",
              postal_code: req.body.order.shippingAddress.postalCode,
              country_code: "US",
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
  res.json(resp);
});

export { createOrder, captureOrder };
