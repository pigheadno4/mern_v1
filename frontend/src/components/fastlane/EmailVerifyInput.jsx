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
        const fastlaneObj = await fastlanesdk.Fastlane({
          // shippingAddressOptions: {
          //   allowedLocations: [],
          // },
          // cardOptions: {
          //   allowedBrands: [],
          // },
        });

        (
          await fastlaneObj.FastlaneWatermarkComponent({
            includeAdditionalInfo: true,
          })
        ).render("#watermark-container");
        setFastlane(fastlaneObj);
        setLoaded(true);
      }
    };
    initialFastlane();
  }, [isResolved]);
  const submitHandler = async (e) => {
    e.preventDefault();
    await fastlane.identity.lookupCustomerByEmail(email);
  };
  return (
    loaded && (
      <Form onSubmit={submitHandler} className="d-flex">
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
        <Button type="submit" variant="outline-light" className="p-2 mx-2">
          Continue
        </Button>
      </Form>
    )
  );
}
export default EmailVerifyInput;
