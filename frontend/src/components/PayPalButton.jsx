import { PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";
import {
  useCreateOrderMutation,
  usePayOrderMutation,
} from "../slices/ordersApiSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { PAYPAL_API_URL } from "../constants";
import { clearCartItems } from "../slices/cartSlice";
import { useProfileMutation } from "../slices/usersApiSlice";

function PayPalButton({ paymentMethod }) {
  //   let sysOrderId = "";
  const dispatch = useDispatch();
  //   const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [createInternalOrder] = useCreateOrderMutation();
  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();
  //   const { data: order, refetch } = useGetOrderDetailsQuery(sysOrderId);
  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [sysOrderId, SetSysOrderId] = useState("");
  console.log(userInfo);

  const styles = {
    borderRadius: 10,
  };

  function onError(err) {
    toast.error(err.message);
  }

  async function createOrder() {
    console.log("create order");
    try {
      // Store system order data in DB before create PayPal order
      const res = await createInternalOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress._id,
        billingAddress: cart.billingAddress._id,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      SetSysOrderId(res._id);
      //   refetch();
      //   sysOrderId = res._id;
      //   refetch();
      //   console.log(order);
      console.log(sysOrderId);
      console.log(res);
      const data = {
        ...res,
        shippingAddress: cart.shippingAddress,
        billingAddress: cart.billingAddress,
        user: {
          _id: userInfo._id,
          name: userInfo.name,
          email: userInfo.email,
        },
      };
      console.log(data);
      // Create PayPal Order for vaulting
      let response;
      if (cart.vault) {
        response = await fetch(
          `${PAYPAL_API_URL}/create-paypal-order-vaulting`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order: data }),
          }
        );
      } else {
        response = await fetch(`${PAYPAL_API_URL}/create-paypal-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: data }),
        });
      }

      // Create PayPal Order

      const orderData = await response.json();
      console.log("create order response: ", orderData);
      if (!orderData.id) {
        const errorDetail = orderData.details[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : "Unexpected error occurred, please try again.";

        throw new Error(errorMessage);
      }

      return orderData.id;
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  }
  async function onApprove(data) {
    try {
      console.log("onApprove data log");
      console.log(data);
      const response = await fetch(`${PAYPAL_API_URL}/capture-paypal-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderID: data.orderID,
          test: "123456",
        }),
      });

      const details = await response.json();
      console.log(details);
      console.log(sysOrderId);
      await payOrder({ orderId: sysOrderId, details }).unwrap();
      dispatch(clearCartItems());
      // save vaulting id and customer id

      if (cart.vault && userInfo.customer_id === "") {
        const customer_id =
          details.payment_source.paypal.attributes.vault.customer.id;
        const ppVaultId = details.payment_source.paypal.attributes.vault.id;
        const userId = userInfo._id;
        await updateProfile({ userId, customer_id, ppVaultId });
      }
      toast.success("Transaction completed!");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  }

  let funding = "";
  let message = {};
  if (paymentMethod === "PAYPAL") funding = "paypal";
  if (paymentMethod === "Pay Later") {
    funding = "paylater";
    message = { amount: cart.totalPrice };
  }
  if (paymentMethod === "VENMO") funding = "venmo";
  console.log(funding);
  return (
    <PayPalButtons
      style={styles}
      createOrder={createOrder}
      onApprove={onApprove}
      onError={onError}
      fundingSource={funding}
      message={message}
    ></PayPalButtons>
  );
}

export default PayPalButton;
