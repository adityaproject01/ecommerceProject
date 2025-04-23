import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PlaceOrder = () => {
  const { state } = useLocation();
  const cartItems = state?.cartItems || [];

  const [addresses, setAddresses] = useState([]);
  const [newAddresses, setNewAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const [addr1, setAddr1] = useState();
  const [addr2, setAddr2] = useState();
  const [city, setCity] = useState();
  const [states, setStates] = useState();
  const [postal, setPostal] = useState();
  const [country, setCountry] = useState();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const newAddress = {
    full_name: name,
    phone: phone,
    address_line1: addr1,
    address_line2: addr2,
    city: city,
    state: states,
    postal_code: postal,
    country: country,
  };
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/address", {
          headers: { Authorization: token },
        });
        setAddresses(response.data.addresses);
      } catch (err) {
        console.error("Failed to load addresses", err);
      }
    };

    fetchAddresses();
  }, [token]);

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };
  const addAddresses = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/address/add",
        newAddress,
        {
          headers: { Authorization: token },
        }
      );
      setNewAddresses(response.data.addresses);
    } catch (err) {
      console.error("Failed to load addresses", err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert("Please select an address before placing the order.");
      return;
    }

    const orderPayload = {
      items: cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      total_price: calculateTotal(),
      address_id: selectedAddressId,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/order/add",
        orderPayload,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.message === "Order placed successfully") {
        console.log(response.data.message, "successfull");
        console.log(response.data);

        console.log(`/home/order-confirmation/${response.data.orderId}`);
        navigate(`/home/order-confirmation/${response.data.orderId}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error placing order");
    }
  };
  function handleNewAddress(e) {
    e.preventDefault();

    addAddresses();
  }
  console.log(newAddresses);
  return (
    <div>
      <h2>Place Order</h2>

      {cartItems.length === 0 ? (
        <p>No items found in cart.</p>
      ) : (
        <>
          <h3>Select Shipping Address</h3>
          {addresses.length === 0 ? (
            <>
              <p>No saved addresses found. Please add one.</p>
              <form onSubmit={handleNewAddress}>
                <div>
                  <input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    onChange={(e) => setAddr1(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    onChange={(e) => setAddr2(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    onChange={(e) => setStates(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    onChange={(e) => setPostal(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
                <div>
                  <button type="submit">submit</button>
                </div>
              </form>
            </>
          ) : (
            <>
            <p>Add new Addess</p>
            <form onSubmit={handleNewAddress}>
                <div>
                  <input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    onChange={(e) => setAddr1(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    onChange={(e) => setAddr2(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    onChange={(e) => setStates(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    onChange={(e) => setPostal(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
                <div>
                  <button type="submit">submit</button>
                </div>
              </form>
              {addresses?.map((addr) => (
                <div key={addr.id}>
                  <label>
                    <input
                      type="radio"
                      name="selectedAddress"
                      value={addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                    />
                    {addr.full_name}, {addr.phone}, {addr.address_line1},{" "}
                    {addr.city}, {addr.state}, {addr.postal_code},{" "}
                    {addr.country}
                  </label>
                </div>
              ))}
            </>
          )}

          <h3>Cart Summary</h3>
          {cartItems.map((item, index) => (
            <p key={index}>
              {item.name} - ₹{item.price} × {item.quantity}
            </p>
          ))}
          <h4>Total: ₹{calculateTotal()}</h4>

          <button onClick={handlePlaceOrder}>Place Order</button>
        </>
      )}
    </div>
  );
};

export default PlaceOrder;
