import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const fetchOrderDetails = useCallback(async () => {
    try {
      console.log("Fetching order details for order ID:", orderId); // Log orderId for debugging
      const orderIdInt = parseInt(orderId);
      const response = await axios.get(
        `http://localhost:5000/api/order-confirmation/${orderIdInt}`,
        {
          headers: {
            Authorization: token, // Ensure token is correctly passed
          },
        }
      );

      console.log("API Response:", response.data); // Log API response for debugging

      if (response.data && response.data.order && response.data.items) {
        setOrder(response.data.order);
        setItems(response.data.items);
      } else {
        setError("Invalid response from server. Data format mismatch.");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching order details:", err);

      // Log the error response and message for better debugging
      if (err.response) {
        console.error("Response error data:", err.response.data);
        console.error("Response error status:", err.response.status);
      } else {
        console.error("Error message:", err.message);
      }

      setLoading(false);
      setError("Failed to load order details. Please try again later.");
    }
  }, [orderId, token]);

  useEffect(() => {
    fetchOrderDetails(); // Directly fetch data without delay
  }, [fetchOrderDetails]);

  if (loading) {
    console.log(token);
    return <div><h2>Loading...</h2></div>;
  }

  if (error) {
    return <div><h2>{error}</h2></div>;
  }

  if (!order) {
    return <div><h2>Order not found</h2></div>;
  }

  return (
    <div>
      <h2>✅ Order Placed Successfully!</h2>
      {console.log("Order ID from URL params:", orderId)}

      <h3>Products:</h3>
      <ul>
        {items.length > 0 ? (
          items.map((item, index) => (
            <li key={index}>
              <strong>Product Name:</strong> {item.product_name} <br />
              <strong>Quantity:</strong> {item.quantity} <br />
              <strong>Price:</strong> ₹{item.price}
            </li>
          ))
        ) : (
          <p>No products found in this order.</p>
        )}
      </ul>

      <Link to="/home/order-history">View My Orders</Link>
    </div>
  );
};

export default OrderConfirmation;
