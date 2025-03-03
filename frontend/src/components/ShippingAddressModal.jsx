import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { saveShippingAddress } from "../slices/cartSlice";
import InputGroup from "react-bootstrap/InputGroup";
import { useUpdateAddressMutation } from "../slices/addressApiSlice";

function ShippingAddressModal({ show, onHide, refetch }) {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const [address1, setAddress1] = useState(
    shippingAddress?.address_line_1 || ""
  );
  const [address2, setAddress2] = useState(
    shippingAddress?.address_line_2 || ""
  );
  const [area1, setArea1] = useState(shippingAddress?.admin_area_1 || "");
  const [area2, setArea2] = useState(shippingAddress?.admin_area_2 || "");
  const [countryCode, setCountryCode] = useState(
    shippingAddress?.country_code || ""
  );
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postal_code || ""
  );
  const [phoneNumber, setPhoneNumber] = useState(
    shippingAddress?.phone_number || ""
  );
  const [givenName, setGivenName] = useState(
    shippingAddress?.name?.given_name || ""
  );
  const [surname, setSurName] = useState(shippingAddress?.name?.surname || "");

  const [updateAddress] = useUpdateAddressMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("onsubmit");
    const updatedAddress = {
      ...shippingAddress,
      name: { given_name: givenName, surname },
      address_line_1: address1,
      address_line_2: address2,
      admin_area_1: area1,
      admin_area_2: area2,
      postal_code: postalCode,
      country_code: countryCode,
      phone_number: phoneNumber,
    };
    dispatch(saveShippingAddress(updatedAddress));
    try {
      console.log("updatedAddress");
      console.log(updatedAddress);
      await updateAddress(updatedAddress);
      refetch();
    } catch (err) {
      throw new Error(err?.data?.message || err.error);
    }

    onHide();
  };
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Shipping Address
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={submitHandler}>
          <Row className="mb-3">
            <InputGroup as={Col}>
              <InputGroup.Text>First Name</InputGroup.Text>
              <Form.Control
                aria-label="First name"
                value={givenName}
                onChange={(e) => setGivenName(e.target.value)}
              />
            </InputGroup>
            <InputGroup as={Col}>
              <InputGroup.Text>Last Name</InputGroup.Text>
              <Form.Control
                aria-label="Last name"
                value={surname}
                onChange={(e) => setSurName(e.target.value)}
              />
            </InputGroup>
          </Row>
          <InputGroup className="mb-3">
            <InputGroup.Text>US +1 </InputGroup.Text>
            <Form.Control
              aria-label="Phone Number"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Address 1</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Address Line 1"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
            ></Form.Control>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Address 2</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Address Line 2"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
            ></Form.Control>
          </InputGroup>
          <Row>
            <InputGroup className="mb-3 " as={Col}>
              <InputGroup.Text>City</InputGroup.Text>
              <Form.Control
                aria-label="City"
                placeholder="City"
                value={area1}
                onChange={(e) => setArea1(e.target.value)}
              />
            </InputGroup>

            <InputGroup className="mb-3 " as={Col}>
              <InputGroup.Text>State</InputGroup.Text>
              <Form.Control
                aria-label="State"
                placeholder="State"
                value={area2}
                onChange={(e) => setArea2(e.target.value)}
              />
            </InputGroup>
          </Row>
          <Row className="mb-3">
            <InputGroup className="mb-3 " as={Col}>
              <InputGroup.Text>Postal Code</InputGroup.Text>
              <Form.Control
                aria-label="Postal Code"
                placeholder="Postal Code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </InputGroup>

            <InputGroup className="mb-3 " as={Col}>
              <InputGroup.Text>Country</InputGroup.Text>
              <Form.Control
                aria-label="Country"
                placeholder="Country"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              />
            </InputGroup>
          </Row>
          <Button type="submit" variant="primary" className="my-2 mx-2">
            Save
          </Button>
          <Button onClick={onHide}>Close</Button>
        </Form>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}

export default ShippingAddressModal;
