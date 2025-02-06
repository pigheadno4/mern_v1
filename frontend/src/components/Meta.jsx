import { Helmet } from "react-helmet-async";

function Meta({
  title = "Welcome to TT's Demo Shop",
  description = "It is the integration DEMO site via TT",
  keywords = "Integration, PayPal, DEMO",
}) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
}

export default Meta;
