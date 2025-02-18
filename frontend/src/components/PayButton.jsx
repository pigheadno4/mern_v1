import PayPalButton from "./PayPalButton";
import ACDCButton from "./ACDCButton";
import GPayButton from "./GooglePayButton";
import { usePayPalScriptReducer } from "@paypal/react-paypal-js";

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
  const [{ isResolved }] = usePayPalScriptReducer();
  return (
    <>
      {/* <GooglePayButton /> */}
      {/* <div>{payButton}</div> */}
      {/* <div hidden={true}>
        <Button variant="contained">test</Button>
      </div> */}
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
      <div hidden={paymentMethod === "GOOGLE" ? false : true}>
        {isResolved && <GPayButton />}
      </div>
    </>
  );
}
export default PayButton;
