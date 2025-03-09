import { Row, Col } from "react-bootstrap";
import { useGetProductsQuery } from "../slices/productApiSlice";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import Message from "../components/Message";
import { useParams } from "react-router-dom";
import Product from "../components/Product";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";
import Paginate from "../components/Paginate";
import { PayPalMessages } from "@paypal/react-paypal-js";
// import { PAYPAL_API_URL, PAYPAL_CLIENT_ID } from "../constants";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   usePayPalScriptReducer,
//   PayPalMessages,
// } from "@paypal/react-paypal-js";
// import { useSelector } from "react-redux";
// import { useCallback, useEffect } from "react";

function HomeScreen() {
  // const { userInfo } = useSelector((state) => state.auth);
  // const cart = useSelector((state) => state.cart);
  // console.log("Home page userinfo: ", userInfo);
  // console.log("Home page cart: ", cart);
  // const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const { data } = await axios.get("/api/products");
  //     console.log(data);
  //     setProducts(data);
  //   };

  //   fetchProducts();
  // }, []);
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });
  // const [{ options, isResolved }, paypalDispatch] = usePayPalScriptReducer();
  // useEffect(() => {
  //   const loadPayPalScript = async () => {
  //     let param = {};
  //     console.log("loadPayPalScript!!!!!!!!!!!!!");
  //     if (cart.vault) {
  //       param = {
  //         target_customer_id: userInfo.customer_id,
  //       };
  //     }
  //     //         console.log("param: ", param);
  //     const resp = await fetch(`${PAYPAL_API_URL}/get-access-token-vault`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(param),
  //     });
  //     const respData = await resp.json();
  //     console.log("access resp: ", respData.id_token);
  //     paypalDispatch({
  //       type: "resetOptions",
  //       value: {
  //         "client-id": PAYPAL_CLIENT_ID,
  //         currency: "USD",
  //         buyerCountry: "US",
  //         merchantId: "DDWAX7MLZJHDC",
  //         locale: "en_US",
  //         // dataUserIdToken: respData.id_token,
  //         enableFunding: "venmo",
  //         components: ["buttons", "card-fields", "googlepay", "applepay"],
  //         dataUserIdToken: respData.id_token,
  //       },
  //     });
  //     paypalDispatch({
  //       type: "setLoadingStatus",
  //       value: "pending",
  //     });
  //   };
  //   // if (!window.paypal) {
  //   loadPayPalScript();
  //   // }
  // }, [paypalDispatch, userInfo.customer_id, cart.vault]);

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light mb-4">
          Go Back
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta />
          <h1>Latest Products</h1>
          <div>
            <PayPalMessages
              placement="home"
              style={{
                ratio: "20x1",
                layout: "flex",
                color: "white-no-border",
              }}
            />
          </div>
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
}

export default HomeScreen;
