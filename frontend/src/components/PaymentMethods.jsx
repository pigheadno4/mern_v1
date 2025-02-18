import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Divider from "@mui/material/Divider";
import paypal from "../../dist/svg/paypal-144.svg";
import paylater from "../../dist/svg/pay-later-144.svg";
import card from "../../dist/svg/credit-card.svg";
import googlepay from "../../dist/svg/google-pay.svg";
import applepay from "../../dist/svg/apple-pay.svg";
import venmo from "../../dist/svg/venmo.svg";

function PaymentMethod({ setPaymentMethod, payment }) {
  const handleChange = (event) => {
    setPaymentMethod(event.target.value);
  };
  return (
    <FormControl>
      {/* <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel> */}
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={payment}
        // value={value}
        onChange={handleChange}
      >
        <div>
          <FormControlLabel
            value="PAYPAL"
            control={<Radio />}
            label={<img src={paypal} alt="PayPal" style={{ width: "35px" }} />}
          />
          <FormLabel id="paypal_label" focused={payment === "PAYPAL"}>
            PayPal
          </FormLabel>
        </div>
        <Divider variant="middle" />
        <div>
          <FormControlLabel
            value="Pay Later"
            control={<Radio />}
            label={
              <img
                src={paylater}
                alt="PayPal Pay Later"
                style={{ width: "35px" }}
              />
            }
          />
          <FormLabel id="paylater_label" focused={payment === "Pay Later"}>
            Pay Later
          </FormLabel>
        </div>
        <Divider variant="middle" />
        <div>
          <FormControlLabel
            value="ACDC"
            control={<Radio />}
            label={
              <img src={card} alt="Credit Card" style={{ width: "35px" }} />
            }
          />
          <FormLabel id="card_label" focused={payment === "ACDC"}>
            Credit Card
          </FormLabel>
        </div>
        <Divider variant="middle" />
        <div>
          <FormControlLabel
            value="APPLE"
            control={<Radio />}
            label={
              <img src={applepay} alt="Apple Pay" style={{ width: "35px" }} />
            }
          />
          <FormLabel id="apple_label" focused={payment === "APPLE"}>
            Apple Pay
          </FormLabel>
        </div>
        <Divider variant="middle" />
        <div>
          <FormControlLabel
            value="GOOGLE"
            control={<Radio />}
            label={
              <img src={googlepay} alt="Google Pay" style={{ width: "35px" }} />
            }
          />
          <FormLabel id="google_label" focused={payment === "GOOGLE"}>
            Google Pay
          </FormLabel>
        </div>
        <Divider variant="middle" />
        <div>
          <FormControlLabel
            value="VENMO"
            control={<Radio />}
            label={<img src={venmo} alt="Venmo" style={{ width: "35px" }} />}
          />
          <FormLabel id="venmo_label" focused={payment === "VENMO"}>
            Venmo
          </FormLabel>
        </div>
      </RadioGroup>
    </FormControl>
  );
}
export default PaymentMethod;
