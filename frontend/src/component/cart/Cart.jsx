import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const token = localStorage.getItem("token");
  const [cartDetails, setCartDetails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/cart", {
          headers: {
            Authorization: token,
          },
        });
        setCartDetails(response.data);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    fetchCart();
  }, [token]);

  const handleBuyNow = () => {
    navigate("/home/place-order", { state: { cartItems: cartDetails } });
  };

  const totalPrice = cartDetails.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div>
      {cartDetails.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        cartDetails.map((item, index) => (
          <div key={index}>
            <div>{item.name} - ₹{item.price} x {item.quantity}</div>
            <img src={item.image_url} alt={item.name} width={100} />
          </div>
        ))
      )}
      <div>
        <strong>Total: ₹{totalPrice}</strong>
      </div>
      <button onClick={handleBuyNow}>Buy Now</button>
    </div>
  );
};

export default Cart;
