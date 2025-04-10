import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  useCreateOrderMutation,
  usePayOrderMutation,
} from "../slices/ordersApiSlice";
import { PAYPAL_API_URL } from "../constants";
import { clearCartItems } from "../slices/cartSlice";

function APayButton() {
  // const [appleConfig, setAppleConfig] = useState({});
  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [createInternalOrder] = useCreateOrderMutation();
  // const [applepay, setApplepay] = useState();

  async function onClick(applePayConfig, applepay) {
    const {
      isEligible,
      countryCode,
      currencyCode,
      merchantCapabilities,
      supportedNetworks,
    } = applePayConfig;
    console.log({ merchantCapabilities, currencyCode, supportedNetworks });

    const paymentRequest = {
      countryCode,
      currencyCode: "USD",
      merchantCapabilities,
      supportedNetworks,
      requiredBillingContactFields: ["name", "phone", "email", "postalAddress"],
      requiredShippingContactFields: [
        "name",
        "phone",
        "email",
        "postalAddress",
      ],
      lineItems: [
        {
          label: "Item Subtotal",
          type: "final",
          amount: cart.itemsPrice,
        },
        {
          label: "Shipping Price",
          amount: cart.shippingPrice,
          type: "final",
        },
        {
          label: "Estimated Tax",
          amount: cart.taxPrice,
          type: "final",
        },
      ],
      total: {
        label: "Demo (Card is not charged)",
        amount: cart.totalPrice,
        type: "final",
      },
    };
    console.log("Apple Payment Request:", paymentRequest);
    // eslint-disable-next-line no-undef
    let session = new ApplePaySession(4, paymentRequest);

    session.onvalidatemerchant = (event) => {
      console.log("in onvalidatemerchant print event");
      console.log(event);
      applepay
        .validateMerchant({
          validationUrl: event.validationURL,
        })
        .then((payload) => {
          console.log(
            "in onvalidatemerchant after validateMerchant print payload"
          );
          console.log(payload);
          session.completeMerchantValidation(payload.merchantSession);
        })
        .catch((err) => {
          console.error(err);
          session.abort();
        });
    };

    session.onpaymentmethodselected = () => {
      session.completePaymentMethodSelection({
        newTotal: paymentRequest.total,
      });
    };
    session.onpaymentauthorized = async (event) => {
      console.log("in onpaymentauthorized print event");
      console.log(event);
      try {
        // Create Internal Order
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
        console.log("internal create order resp: ", res);
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
        console.log("create paypal order data: ", data);
        /* Create Order on the Server Side */
        const response = await fetch(`${PAYPAL_API_URL}/create-paypal-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: data }),
        });

        if (!response.ok) {
          throw new Error("error creating order");
        }
        const orderData = await response.json();
        console.log(orderData.id);
        /**
         * Confirm Payment
         */
        const confirmResp = await applepay.confirmOrder({
          orderId: orderData.id,
          token: event.payment.token,
          billingContact: event.payment.billingContact,
          shippingContact: event.payment.shippingContact,
        });
        console.log("confirm apple order resp:", confirmResp);
        /*
         * Capture order (must currently be made on server)
         */
        const CaptureResp = await fetch(
          `${PAYPAL_API_URL}/capture-paypal-order`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderID: orderData.id,
              test: "123456",
            }),
          }
        );
        // await fetch(`/api/orders/${id}/capture`, {
        //   method: "POST",
        // });
        const details = await CaptureResp.json();
        console.log("PayPal Capture");
        console.log(details);

        await payOrder({ orderId: res._id, details }).unwrap();
        console.log("set order internally to pay");
        dispatch(clearCartItems());
        toast.success("Transaction completed!");

        session.completePayment({
          status: window.ApplePaySession.STATUS_SUCCESS,
        });
      } catch (err) {
        console.error(err);
        session.completePayment({
          status: window.ApplePaySession.STATUS_FAILURE,
        });
      }
    };

    session.oncancel = () => {
      console.log("Apple Pay Cancelled !!");
    };

    session.begin();
  }
  useEffect(() => {
    const preparePaymentRequest = async () => {
      const applePayConfig = await window.vaultsdk.Applepay().config();
      // setApplepay();
      console.log("Apple Config:", applePayConfig);
      if (applePayConfig.isEligible) {
        document.getElementById("applepay-container").innerHTML =
          '<apple-pay-button id="btn-appl" buttonstyle="black" type="buy" locale="en" style="width: 100%">';
        document
          .getElementById("btn-appl")
          .addEventListener("click", () =>
            onClick(applePayConfig, window.vaultsdk.Applepay())
          );
      }
      // setAppleConfig(applePayConfig);
    };
    preparePaymentRequest();
  }, []);

  return <div id="applepay-container"></div>;
}

export default APayButton;
