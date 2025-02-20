import { useState, useEffect } from "react";

function APayButton() {
  const [appleConfig, setAppleConfig] = useState({});

  async function onClick(applePayConfig) {
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
      requiredShippingContactFields: [],
      total: {
        label: "Demo (Card is not charged)",
        amount: "10.00",
        type: "final",
      },
    };
    console.log("Apple Payment Request:", paymentRequest);
    // eslint-disable-next-line no-undef
    let session = new ApplePaySession(4, paymentRequest);

    session.onvalidatemerchant = (event) => {
      applepay
        .validateMerchant({
          validationUrl: event.validationURL,
        })
        .then((payload) => {
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
      try {
        /* Create Order on the Server Side */
        const orderResponse = await fetch(`/api/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!orderResponse.ok) {
          throw new Error("error creating order");
        }

        const { id } = await orderResponse.json();
        console.log({ id });
        /**
         * Confirm Payment
         */
        await applepay.confirmOrder({
          orderId: id,
          token: event.payment.token,
          billingContact: event.payment.billingContact,
          shippingContact: event.payment.shippingContact,
        });

        /*
         * Capture order (must currently be made on server)
         */
        await fetch(`/api/orders/${id}/capture`, {
          method: "POST",
        });

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
      const applePayConfig = await paypal.Applepay().config();
      console.log("Apple Config:", applePayConfig);
      if (applePayConfig.isEligible) {
        document.getElementById("applepay-container").innerHTML =
          '<apple-pay-button id="btn-appl" buttonstyle="black" type="buy" locale="en">';
        document
          .getElementById("btn-appl")
          .addEventListener("click", () => onClick(applePayConfig));
      }
      setAppleConfig(applePayConfig);
    };
    preparePaymentRequest();
  }, []);

  return <div id="applepay-container"></div>;
}

export default APayButton;
