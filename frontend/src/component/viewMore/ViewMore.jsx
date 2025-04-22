import axios from "axios";
import "./viewMore.css";
import { useNavigate } from "react-router-dom";

const ViewMore = ({ ViewMoreDetails }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logoutButton = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  async function handleAddCart(ViewMoreDetails) {
    const cartGetItem = {
      product_id: ViewMoreDetails.id,
      quantity: 1,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/cart/add",
        cartGetItem,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      console.log("Cart Add Response:", response.data);
      navigate("/home/cart");
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error.message);
    }
  }

  return (
    <div className="home">
      <div className="homeBackground">
        <div className="homeHeadderBody">
          <div className="homeHeadder">
            <p className="bannerTitle1">Welcome to online shopping</p>
          </div>
          <button onClick={logoutButton}>Logout</button>
        </div>

        <div className="products">
          <div className="subProducts">
            <div className="productCard">
              <img
                src={ViewMoreDetails.image_url}
                alt=""
                className="productImage"
              />
              <p className="categoryDetails">{ViewMoreDetails.name}</p>
              <p className="categoryDetails">{ViewMoreDetails.description}</p>
              <p>{ViewMoreDetails.price}</p>
              <button
                onClick={() => handleAddCart(ViewMoreDetails)}
              >
                AddToCart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMore;
