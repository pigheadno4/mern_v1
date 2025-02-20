import GooglePayButton from "@google-pay/button-react";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  useCreateOrderMutation,
  usePayOrderMutation,
  //   useGetOrderDetailsQuery,
} from "../slices/ordersApiSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { PAYPAL_API_URL } from "../constants";
import { clearCartItems } from "../slices/cartSlice";

function GPayButton() {
  const internalId = useRef("");
  const test = useRef();
  const dispatch = useDispatch();
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [createInternalOrder] = useCreateOrderMutation();
  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [paymentRequest, setPaymentRequest] = useState({});
  const [loadStatus, setLoadStatus] = useState(false);
  //   const appendGoogleSdkScript = () => {
  //     const script = document.createElement("script");
  //     script.id = "google-sdk";
  //     script.src = "https://pay.google.com/gp/p/js/pay.js";
  //     script.async = true;
  //     // script.defer = true;
  //     // script.crossOrigin = "anonymous";
  //     script.onload = () => setHasLoaded(true);
  //     document.body.append(script);
  //   };
  //   const baseRequest = {
  //     apiVersion: 2,
  //     apiVersionMinor: 0,
  //   };
  function onPaymentAuthorized(paymentData) {
    return new Promise(function (resolve, reject) {
      processPayment(paymentData)
        .then(function (data) {
          console.log("processing successful");
          console.log(data);
          resolve({ transactionState: "SUCCESS" });
        })
        .catch(function (errDetails) {
          console.log("processing failed");
          console.log(errDetails);
          resolve({ transactionState: "ERROR" });
        });
    });
  }
  const getGoogleTransactionInfo = useCallback(() => {
    return {
      displayItems: [
        {
          label: "Subtotal",
          type: "SUBTOTAL",
          price: cart.totalPrice,
        },
        {
          label: "Tax",
          type: "TAX",
          price: cart.taxPrice,
        },
        {
          label: "Shipping",
          type: "LINE_ITEM",
          price: cart.shippingPrice,
        },
      ],
      countryCode: "US",
      currencyCode: "USD",
      totalPriceStatus: "FINAL",
      totalPrice: cart.totalPrice,
      totalPriceLabel: "Total",
    };
  }, [cart]);
  async function processPayment(paymentData) {
    try {
      const res = await createInternalOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      internalId.current = res._id;
      //   SetSysOrderId(res._id);
      //   refetch();
      //   sysOrderId = res._id;
      //   refetch();
      //   console.log(order);
      //   console.log(sysOrderId);
      console.log(res);
      const data = {
        ...res,
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
      const { status } = await paypal.Googlepay().confirmOrder({
        orderId: orderData.id,
        paymentMethodData: paymentData.paymentMethodData,
      });
      if (status === "APPROVED") {
        /* Capture the Order */
        // const captureResponse = await fetch(`/orders/${id}/capture`, {
        //   method: "POST",
        // }).then((res) => res.json());
        console.log("onApprove data log");
        console.log(data);
        const response = await fetch(`${PAYPAL_API_URL}/capture-paypal-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderID: orderData.id,
            test: "123456",
          }),
        });

        const details = await response.json();
        console.log("PayPal Capture");
        console.log(details);
        await payOrder({ orderId: res._id, details }).unwrap();
        console.log("set order internally to pay");
        dispatch(clearCartItems());
        toast.success("Transaction completed!");
        return { transactionState: "SUCCESS" };
      } else {
        return { transactionState: "ERROR" };
      }
    } catch (err) {
      return {
        transactionState: "ERROR",
        error: {
          message: err.message,
        },
      };
    }
  }
  const handleLoadPaymentData = (paymentData) => {
    console.log("Payment data", paymentData);
  };
  useEffect(() => {
    const preparePaymentRequest = async () => {
      const googlePayConfig = await paypal.Googlepay().config();
      console.log("googlePay Config", googlePayConfig);
      const allowedPaymentMethods = googlePayConfig.allowedPaymentMethods;
      console.log("allowedPaymentMethods:", allowedPaymentMethods);
      const merchantInfo = googlePayConfig.merchantInfo;
      console.log("merchantInfo:", merchantInfo);
      const paymentDataRequest = { apiVersion: 2, apiVersionMinor: 0 };
      paymentDataRequest.allowedPaymentMethods = allowedPaymentMethods;
      paymentDataRequest.transactionInfo = getGoogleTransactionInfo();
      paymentDataRequest.merchantInfo = merchantInfo;
      paymentDataRequest.callbackIntents = ["PAYMENT_AUTHORIZATION"];
      console.log("paymentDataRequest", paymentDataRequest);
      setPaymentRequest(paymentDataRequest);
      setLoadStatus(true);
      //   test.current = paymentDataRequest;
      console.log("test data", test.current);
    };
    preparePaymentRequest();
  }, [getGoogleTransactionInfo]);

  return (
    <>
      {loadStatus && (
        <GooglePayButton
          environment="TEST"
          buttonSizeMode="fill"
          paymentRequest={paymentRequest}
          onLoadPaymentData={handleLoadPaymentData}
          onError={(error) => console.error(error)}
          onPaymentAuthorized={onPaymentAuthorized}
          style={{ width: "100%" }}
          // //   onPaymentDataChanged={(paymentData) =>
          // //     getUpdatedPaymentData(paymentRequest, paymentData)
          //   }
        />
      )}
    </>
  );
}

export default GPayButton;
