import PayPalButton from "./PayPalButton";
import ACDCButton from "./ACDCButton";
import GPayButton from "./GooglePayButton";
import { usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useExternalScript } from "../utils/useExternalScript.js";
import APayButton from "./AppleButton.jsx";

// import GooglePayButton from "./GooglePayButton";

function PayButton({ paymentMethod }) {
  //   if (
  //     paymentMethod === "PAYPAL" ||
  //     paymentMethod === "Pay Later" ||
  //     paymentMethod === "VENMO"
  //   ) {
  //     payButton = <PayPalButton paymentMethod={paymentMethod} />;
  //   }

  //   if (paymentMethod === "ACDC") payButton = <ACDCButton />;
  const appleScript =
    "https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js";
  const appleJSLoadingStatus = useExternalScript(appleScript);

  const [{ isPending, isRejected, isResolved }] = usePayPalScriptReducer();
  return (
    <>
      {/* <GooglePayButton /> */}
      {/* <div>{payButton}</div> */}
      {/* <div hidden={true}>
        <Button variant="contained">test</Button>
      </div> */}

      {isResolved && (
        <>
          <div hidden={paymentMethod === "ACDC" ? false : true}>
            <ACDCButton />
          </div>
          <div hidden={paymentMethod === "PAYPAL" ? false : true}>
            <PayPalButton paymentMethod={"PAYPAL"} />
          </div>
          <div hidden={paymentMethod === "Pay Later" ? false : true}>
            <PayPalButton paymentMethod={"Pay Later"} />
          </div>
          <div hidden={paymentMethod === "VENMO" ? false : true}>
            <PayPalButton paymentMethod={"VENMO"} />
          </div>
          <div hidden={paymentMethod === "APPLE" ? false : true}>
            {appleJSLoadingStatus === "ready" && ApplePaySession ? (
              <APayButton />
            ) : (
              <p>Your Device cannot support Apple Pay</p>
            )}
          </div>
          <div hidden={paymentMethod === "GOOGLE" ? false : true}>
            <GPayButton />
          </div>
        </>
      )}
    </>
  );
}
export default PayButton;
