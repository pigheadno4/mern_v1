import {
  usePayPalCardFields,
  PayPalCardFieldsProvider,
  PayPalCardFieldsForm,
} from "@paypal/react-paypal-js";
import { useEffect, useState, useRef } from "react";
import {
  useGetPayPalClientIdQuery,
  useCreateOrderMutation,
  usePayOrderMutation,
  //   useGetOrderDetailsQuery,
} from "../slices/ordersApiSlice";
// import type { CardFieldsOnApproveData } from "@paypal/paypal-js";

import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { PAYPAL_API_URL } from "../constants";
import { clearCartItems } from "../slices/cartSlice";

function ACDCButton() {
  const internalId = useRef("");
  const [isPaying, setIsPaying] = useState(false);
  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [createInternalOrder] = useCreateOrderMutation();
  const [sysOrderId, SetSysOrderId] = useState("test");

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
      internalId.current = res._id;
      //   refetch();
      //   sysOrderId = res._id;
      //   refetch();
      //   console.log(order);
      console.log(internalId.current);
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
      // Create PayPal Order
      const response = await fetch(`${PAYPAL_API_URL}/create-paypal-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: data }),
      });
      const orderData = await response.json();
      console.log(orderData);
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
      console.log(internalId.current);
      await payOrder({ orderId: internalId.current, details }).unwrap();
      dispatch(clearCartItems());
      toast.success("Transaction completed!");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  }

  return (
    <PayPalCardFieldsProvider
      createOrder={createOrder}
      onApprove={onApprove}
      onError={(err) => {
        console.log(err);
      }}
    >
      <PayPalCardFieldsForm />
      {/* Custom client component to handle card fields submit */}
      <SubmitPayment isPaying={isPaying} setIsPaying={setIsPaying} />
    </PayPalCardFieldsProvider>
  );
}
const SubmitPayment = ({ isPaying, setIsPaying }) => {
  const { cardFieldsForm, fields } = usePayPalCardFields();

  const handleClick = async () => {
    if (!cardFieldsForm) {
      const childErrorMessage =
        "Unable to find any child components in the <PayPalCardFieldsProvider />";

      throw new Error(childErrorMessage);
    }
    const formState = await cardFieldsForm.getState();

    if (!formState.isFormValid) {
      return alert("The payment form is invalid");
    }
    setIsPaying(true);

    cardFieldsForm.submit().catch((err) => {
      toast.error(err?.data?.message || err.message);
      setIsPaying(false);
    });
  };

  return (
    <button
      className={isPaying ? "btn" : "btn btn-primary"}
      style={{ float: "right" }}
      onClick={handleClick}
    >
      {isPaying ? <div className="spinner tiny" /> : "Pay"}
    </button>
  );
};
export default ACDCButton;
