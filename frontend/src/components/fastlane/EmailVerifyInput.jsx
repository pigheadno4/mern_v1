import { Form, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { usePayPalScriptReducer } from "@paypal/react-paypal-js";

function EmailVerifyInput() {
  const [email, setEmail] = useState("");
  const [fastlane, setFastlane] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [{ isResolved }] = usePayPalScriptReducer();
  useEffect(() => {
    const initialFastlane = async () => {
      if (isResolved) {
        const fastlaneObj = await window.fastlanesdk.Fastlane();

        // (
        //   await fastlaneObj.FastlaneWatermarkComponent({
        //     includeAdditionalInfo: true,
        //   })
        // ).render("#watermark-container");
        setFastlane(fastlaneObj);
        setLoaded(true);
      }
    };
    initialFastlane();
  }, [isResolved]);

  const setPaymentSummary = (paymentToken) => {
    document.getElementById("selected-card").innerText = paymentToken
      ? `💳 •••• ${paymentToken.paymentSource.card.lastDigits}`
      : "";
  };

  const getAddressSummary = ({
    companyName,
    address: {
      addressLine1,
      addressLine2,
      adminArea2,
      adminArea1,
      postalCode,
      countryCode,
    } = {},
    name: { firstName, lastName, fullName } = {},
    phoneNumber: { countryCode: telCountryCode, nationalNumber } = {},
  }) => {
    const isNotEmpty = (field) => !!field;
    const summary = [
      fullName || [firstName, lastName].filter(isNotEmpty).join(" "),
      companyName,
      [addressLine1, addressLine2].filter(isNotEmpty).join(", "),
      [
        adminArea2,
        [adminArea1, postalCode].filter(isNotEmpty).join(" "),
        countryCode,
      ]
        .filter(isNotEmpty)
        .join(", "),
      [telCountryCode, nationalNumber].filter(isNotEmpty).join(""),
    ];
    return summary.filter(isNotEmpty).join("\n");
  };

  const setShippingSummary = (address) => {
    document.querySelector(".summary_shipping").innerText =
      getAddressSummary(address);
  };
  const setBillingSummary = (address) => {
    document.querySelector(".summary_billing").innerText = getAddressSummary({
      address,
    });
  };
  const onClickHandler = async () => {
    const { selectionChanged, selectedAddress } =
      await fastlane.profile.showShippingAddressSelector();

    if (selectionChanged) {
      // selectedAddress contains the new address
      console.log("New address:", selectedAddress);

      // update state & form UI
      const shippingAddress = selectedAddress;
      setShippingSummary(shippingAddress);
    } else {
      // selection modal was dismissed without selection
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    let memberAuthenticatedSuccessfully;
    let shippingAddress;
    let billingAddress;
    let paymentToken;
    const cardComponent = await fastlane.FastlaneCardComponent();
    const { customerContextId } = await fastlane.identity.lookupCustomerByEmail(
      email
    );
    console.log("customerContextId", customerContextId);
    const authResponse = await fastlane.identity.triggerAuthenticationFlow(
      customerContextId
    );
    console.log("Auth response:", authResponse);

    if (authResponse?.authenticationState === "succeeded") {
      console.log("sccccccccccc");
      memberAuthenticatedSuccessfully = true;
      paymentToken = authResponse.profileData.card;
      shippingAddress = authResponse.profileData.shippingAddress;
      billingAddress = paymentToken?.paymentSource.card.billingAddress;
    } else {
      // user was not recognized
      console.log("No customerContextId");
    }

    if (shippingAddress) {
      setShippingSummary(shippingAddress);
    }

    setPaymentSummary(paymentToken);

    // cardComponent.render("#card-component");
  };
  return (
    loaded && (
      <Form onSubmit={submitHandler} className="ms-auto">
        <fieldset className="email-input-with-watermark">
          <Form.Control
            type="text"
            name="q"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Fastlane Email Address"
            className="mr-sm-2 ml-sm-5"
          ></Form.Control>
          <div id="watermark-container"></div>
        </fieldset>
        <Button type="submit" className="w-full mt-2">
          Continue
        </Button>
        <div className="header">
          <h4>Shipping</h4>
        </div>
        <div className="summary_shipping"></div>
        <Button
          id="shipping-edit-button"
          type="button"
          className="edit-button"
          onClick={onClickHandler}
        >
          <span className="button-icon"></span>
          Edit
        </Button>

        <div id="selected-card"></div>
        <div id="card-component"></div>
      </Form>
    )
  );
}
export default EmailVerifyInput;
