import { Form, Button } from "react-bootstrap";
import { useEffect, useState } from "react";

function EmailVerifyInput() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const initialFastlane = async () => {
      const {
        identity,
        profile,
        FastlanePaymentComponent,
        FastlaneWatermarkComponent,
      } = await paypal.Fastlane({
        // shippingAddressOptions: {
        //   allowedLocations: [],
        // },
        // cardOptions: {
        //   allowedBrands: [],
        // },
      });

      (
        await FastlaneWatermarkComponent({
          includeAdditionalInfo: true,
        })
      ).render("#watermark-container");
    };
    initialFastlane();
  }, []);
  const submitHandler = (e) => {
    e.preventDefault();
  };
  return (
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
  );
}
export default EmailVerifyInput;
