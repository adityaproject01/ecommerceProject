import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderHistory = () => {
  const token = localStorage.getItem("token");
  const [orders, setOrders] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true); // For loading state

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/order-history", {
          headers: {
            Authorization: token, // Correct Bearer token format
          },
        });

        console.log("API Response:", response.data); // Debugging API response

        // Simulate a delay of 2 seconds before setting the data
        setTimeout(() => {
          const fetchedOrders = response.data; // Save response data in a variable
          setOrders(fetchedOrders); // Set the orders
          setRole(fetchedOrders[0]?.role || "customer"); // If role is part of the response
          setLoading(false); // Set loading to false after data is fetched and delayed
        }, 2000); // 2 seconds delay
      } catch (error) {
        console.log("Error fetching order history:", error);
        setLoading(false); // Ensure loading state is turned off in case of an error
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]); // Effect runs when token changes (or initially on mount)

  useEffect(() => {
    console.log("Orders State Updated:", orders); // Debugging orders state
  }, [orders]);

  if (loading) {
    return <p>Loading...</p>; // Show loading message while waiting
  }

  return (
    <div>
      <h2>🧾 Order History ({role})</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div>
          {orders.map((order, index) => (
            <div
              key={index}
              style={{ border: "1px solid #ccc", marginBottom: "10px", padding: "10px" }}
            >
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Total:</strong> ₹{order.total}</p> {/* Show total */}
              {role === "customer" && order.address_id && (
                <p><strong>Shipping Address ID:</strong> {order.address_id}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
