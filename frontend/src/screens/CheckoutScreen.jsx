import { toast } from "react-toastify";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import PayButton from "../components/PayButton";
import { Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import ShippingAddressModal from "../components/ShippingAddressModal";
import PaymentMethod from "../components/PaymentMethods";
import { usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  useGetDefaultShippingQuery,
  useGetDefaultBillingQuery,
} from "../slices/addressApiSlice";
import Grid from "@mui/material/Grid2";
import AddressCard from "../components/AddressCard";
import { Typography } from "@mui/material";
import { useGetPayPalClientIdQuery } from "../slices/ordersApiSlice";
import { saveBillingAddress, saveShippingAddress } from "../slices/cartSlice";
import { PAYPAL_API_URL } from "../constants";
import AddressListModal from "../components/AddressListModal";

function CheckoutScreen() {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: defaultShippingAddress,
    isSuccess: loadedDS,
    refetch: DSRefetch,
  } = useGetDefaultShippingQuery();
  const {
    data: defaultBillingAddress,
    isSuccess: loadedDB,
    refetch: DBRefetch,
  } = useGetDefaultBillingQuery();

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
        let param = {};
        // console.log("userinfo", userInfo);
        if (cart.vault) {
          param = {
            target_customer_id: userInfo.customer_id,
          };
        }
        console.log("param: ", param);
        const resp = await fetch(`${PAYPAL_API_URL}/get-access-token-vault`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(param),
        });
        const respData = await resp.json();
        console.log("access resp: ", respData.id_token);
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
            buyerCountry: "US",
            merchantId: "DDWAX7MLZJHDC",
            locale: "en_US",
            dataUserIdToken: respData.id_token,
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
  }, [paypal, paypalDispatch, loadingPayPal, errorPayPal, userInfo, cart]);

  useEffect(() => {
    if (loadedDS && loadedDB) {
      dispatch(saveShippingAddress(defaultShippingAddress));
      dispatch(saveBillingAddress(defaultBillingAddress));
    }
  }, [
    loadedDS,
    defaultShippingAddress,
    dispatch,
    defaultBillingAddress,
    loadedDB,
  ]);

  console.log(paymentMethod);
  return (
    <>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Grid container spacing={1} justifyContent="space-between">
                <Grid
                  container
                  spacing={1}
                  justifyContent="flex-start"
                  size={6}
                >
                  <Grid size={9}>
                    <Typography variant="h5">Shipping</Typography>
                  </Grid>
                  <Grid size={2}>
                    <AddressListModal isShipping={true} />
                    {/* {loadedDS && `${defaultShippingAddress._id}`} */}
                  </Grid>
                  <Grid size={12}>
                    {loadedDS && (
                      <AddressCard
                        address={defaultShippingAddress}
                        isShipping={true}
                      />
                    )}
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={1}
                  justifyContent="flex-start"
                  size={6}
                >
                  <Grid size={9}>
                    <Typography variant="h5">Billing</Typography>
                  </Grid>
                  <Grid size={2}>
                    <AddressListModal isShipping={false} />
                    {/* {loadedDS && `${defaultShippingAddress._id}`} */}
                  </Grid>
                  <Grid size={12}>
                    {loadedDB && (
                      <AddressCard
                        address={defaultBillingAddress}
                        isShipping={false}
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>
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
      <ShippingAddressModal
        show={show}
        onHide={() => setShow(false)}
        refetch={DSRefetch}
      />
    </>
  );
}

export default CheckoutScreen;
