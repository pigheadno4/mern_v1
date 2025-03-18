// import "./App.css";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
// import HomeScreen from "./screens/HomeScreen";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PAYPAL_CLIENT_ID, PAYPAL_API_URL } from "./constants";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function App() {
  const [options, setOptions] = useState({
    clientId: PAYPAL_CLIENT_ID,
    currency: "USD",
    buyerCountry: "US",
    merchantId: "DDWAX7MLZJHDC",
    locale: "en_US",
    enableFunding: "venmo",
    components: "buttons,card-fields,googlepay,applepay,messages",
  });
  // const [fastlaneOptions, setFastlaneOptions] = useState({
  //   clientId: PAYPAL_CLIENT_ID,
  //   currency: "USD",
  //   buyerCountry: "US",
  //   components: "buttons,fastlane",
  // });
  const [collected, setCollected] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  console.log("Home page userinfo: ", userInfo);
  console.log("Home page cart: ", cart);
  useEffect(() => {
    const getCustomerId = async () => {
      let param = {};
      console.log("loadPayPalScript!!!!!!!!!!!!!");
      if (cart.vault) {
        param = {
          target_customer_id: userInfo?.customer_id,
        };
      }
      // get id token for vaulting
      const resp = await fetch(`${PAYPAL_API_URL}/get-access-token-vault`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(param),
      });
      const respData = await resp.json();
      console.log("id_token: ", respData.id_token);
      // get client token for fastlane
      // const respFastlaneClientToken = await fetch(
      //   `${PAYPAL_API_URL}/get-fastlane-client-token`,
      //   {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //   }
      // );
      // const respFastlaneClientTokenJSON = await respFastlaneClientToken.json();
      // console.log("client token", respFastlaneClientTokenJSON.access_token);

      setOptions((preOptions) => ({
        ...preOptions,

        // "data-sdk-client-token": respFastlaneClientTokenJSON.access_token,
        dataNamespace: "vaultsdk",
        dataUserIdToken: respData.id_token,
      }));
      // setFastlaneOptions((preOptions) => ({
      //   ...preOptions,
      //   // dataNamespace: "fastlanesdk",
      //   "data-sdk-client-token": respFastlaneClientTokenJSON.access_token,
      // }));
      setCollected(true);
    };
    getCustomerId();
  }, [cart.vault, userInfo?.customer_id]);

  return (
    <>
      {collected && (
        // <PayPalScriptProvider options={fastlaneOptions}>
        <PayPalScriptProvider options={options}>
          <Header />
          <main className="py-3">
            <Container>
              <Outlet />
            </Container>
          </main>
          <Footer />
          <ToastContainer />
        </PayPalScriptProvider>
        // </PayPalScriptProvider>
      )}
    </>
  );
}

export default App;
