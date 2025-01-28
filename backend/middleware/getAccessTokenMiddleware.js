import asyncHandler from "./asyncHandler.js";

const getAccessToken = asyncHandler(async (req, res, next) => {
  const auth = Buffer.from(
    process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET
  ).toString("base64");
  const response = await fetch(`${process.env.PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  const jsonData = await response.json();
  req.accessToken = jsonData.access_token;
  // console.log(req.body);
  next();
});

export { getAccessToken };
