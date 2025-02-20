import { useState, useEffect } from "react";

const APayButton = () => {
  useEffect(() => {
    const preparePaymentRequest = async () => {
      const applePayConfig = await paypal.Applepay().config();
      if (applePayConfig.isEligible) {
        document.getElementById("applepay-container").innerHTML =
          '<apple-pay-button id="btn-appl" buttonstyle="black" type="buy" locale="en">';
      }
    };
    preparePaymentRequest();
  }, []);

  return <div id="applepay-container"></div>;
};

export default APayButton;
