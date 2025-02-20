import { toast } from "react-toastify";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaPlus, FaEdit } from "react-icons/fa";
import PayButton from "../components/PayButton";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import ShippingAddressModal from "../components/ShippingAddressModal";
import PaymentMethod from "../components/PaymentMethods";
import { usePayPalScriptReducer } from "@paypal/react-paypal-js";

import { useGetPayPalClientIdQuery } from "../slices/ordersApiSlice";

function CheckoutScreen() {
  // const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  // const user = useSelector((state) => state.auth);
  // const [checkoutStage, setCheckoutStage] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("PAYPAL");
  const [show, setShow] = useState(false);
  const [{ isResolved, isPending, isRejected, isLoading }, paypalDispatch] =
    usePayPalScriptReducer();
  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPayPalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
            buyerCountry: "US",
            locale: "en_US",
            enableFunding: "venmo",
            components: ["buttons", "card-fields", "googlepay", "applepay"],
          },
        });
        paypalDispatch({
          type: "setLoadingStatus",
          value: "pending",
        });
      };
      if (!window.paypal) {
        loadPayPalScript();
      }
    }
  }, [paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  console.log(paymentMethod);
  return (
    <>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              {cart.shippingAddress ? (
                <div>
                  <strong>Address:</strong> {cart.shippingAddress.address},{" "}
                  {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
                  {cart.shippingAddress.country}
                  <Button
                    variant="light"
                    className="btn-sm mx-2"
                    onClick={() => setShow(true)}
                  >
                    <FaEdit />
                  </Button>
                </div>
              ) : (
                <div>
                  <Button variant="primary" onClick={() => setShow(true)}>
                    <FaPlus />
                    Add Shipping Address
                  </Button>
                </div>
              )}
              {/* <p>
              <strong>Address:</strong> {cart.shippingAddress.address},{" "}
              {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
              {cart.shippingAddress.country}
            </p> */}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item._id}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} X ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Shipping Method</h2>
              <strong>Delivery By: UPS</strong>
              {/* {cart.paymentMethod} */}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              {/* <strong>Method: </strong> */}
              <PaymentMethod
                setPaymentMethod={setPaymentMethod}
                payment={paymentMethod}
              />
              {/* {cart.paymentMethod} */}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                {/* {error && (
                <Message variant={"danger"}>{error.data.message}</Message>
              )} */}
              </ListGroup.Item>

              <ListGroup.Item className="d-grid">
                {/* <Button
                  type="button"
                  className="btn-block"
                  disabled={cart.cartItems.length === 0}
                  // onClick={}
                >
                  Place Order
                </Button> */}

                {isResolved && <PayButton paymentMethod={paymentMethod} />}
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
      <ShippingAddressModal show={show} onHide={() => setShow(false)} />
    </>
  );
}

export default CheckoutScreen;
