import { useParams } from "react-router-dom";
import products from "../products.js";

function ProductScreen() {
  const { id: productId } = useParams();
  //   console.log(productId);
  const product = products.find((p) => p._id === Number(productId));

  console.log(product);

  return <div>ProductScreen</div>;
}

export default ProductScreen;
