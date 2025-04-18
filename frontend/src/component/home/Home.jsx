import React, { useEffect, useState } from "react";
import "./home.css";
import AutoSlider from "./AutoSlider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  // const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const logoutButton = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  useEffect(() => {

    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products/");
        setProducts(response.data.products); // assuming response.data is your product list
        console.log("Products fetched:", response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    const fetchCategory=async()=>{
      try {
        const response=await axios.get("http://localhost:5000/api/category")
        setCategory(response.data)
        console.log(response.data,"ddddd")
      } catch (error) {
        console.log(error)
      }
    }
    
fetchCategory()
    fetchProducts();
  }, []); 

  return (
    <div className="home">
      <div className="homeBody"></div>
      <div className="homeBackground">
        <div className="homeHeadderBody">
          <div className="homeHeadder">
            <p className="bannerTitle1">Welcome to online shopping</p>
          </div>
        <button onClick={logoutButton}>Logout</button>

        </div>
        <div className="homeBanner">
          <div className="banner1">
            <AutoSlider />
          </div>
        </div>
        <div className="category">
          <div className="subCategory">
          {category.map((item, index) => (
             <div key={index} className="categoryCard">
             <img src={item.image_url} alt="" className="categoryImage" />
             <p className="categoryDetails">{item.name}</p>
           </div>
            ))}
           
          </div>
        </div>
        <div className="products">
          <div className="subProducts">
          {products.map((item, index) => (
             <div key={index} className="productCard">
             <img src={item.image_url} alt=""className="productImage" />
             <p className="categoryDetails">{item.name}</p>
           </div>
            ))}
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
