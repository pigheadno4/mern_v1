import PayPalButton from "./PayPalButton";
import ACDCButton from "./ACDCButton";
import GPayButton from "./GooglePayButton";
import { usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useExternalScript } from "../utils/useExternalScript.js";
import APayButton from "./AppleButton.jsx";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setVaultStatus } from "../slices/cartSlice";

// import GooglePayButton from "./GooglePayButton";

function PayButton({ paymentMethod }) {
  const [checked, setChecked] = useState(false);
  const dispatch = useDispatch();
  const appleScript =
    "https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js";
  const appleJSLoadingStatus = useExternalScript(appleScript);
  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [{ isPending, isRejected, isResolved }] = usePayPalScriptReducer();

  const onHandleCheckBox = (e) => {
    setChecked(e.target.checked);
    dispatch(setVaultStatus(e.target.checked));
  };

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
            <FormGroup hidden={userInfo.customer_id !== ""}>
              <FormControlLabel
                control={<Checkbox onChange={onHandleCheckBox} />}
                label="Save your PayPal account"
              />
            </FormGroup>
          </div>
          <div hidden={paymentMethod === "Pay Later" ? false : true}>
            <PayPalButton paymentMethod={"Pay Later"} />
          </div>
          <div hidden={paymentMethod === "VENMO" ? false : true}>
            <PayPalButton paymentMethod={"VENMO"} />
          </div>
          <div hidden={paymentMethod === "APPLE" ? false : true}>
            {appleJSLoadingStatus === "ready" && window.ApplePaySession ? (
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
