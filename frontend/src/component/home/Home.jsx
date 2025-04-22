import React, { useEffect, useState } from "react";
import "./home.css";
import AutoSlider from "./AutoSlider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = ({setViewMoreDetails}) => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);

  const [showSubcategory, setShowSubcategory] = useState(false);
  const [showSubSubcategory, setShowSubSubcategory] = useState(false);

  const navigate = useNavigate();
  const baseUrl = "http://localhost:5000";

  const logoutButton = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    axios.get(`${baseUrl}/api/products/`).then((res) => {
      setProducts(res.data.products);
    });

    axios.get(`${baseUrl}/api/category`).then((res) => {
      setCategory(res.data);
    });
  }, []);

  const handleCategoryClick = async (id) => {
    try {
      const res = await axios.get(`${baseUrl}/api/subcategory/category/${id}`);
      setSubCategories(res.data);
      setShowSubcategory(true);
      setShowSubSubcategory(false);

    } catch (err) {
      console.log("Subcategory fetch failed:", err);
    }
  };

  const handleSubCategoryClick = async (subCatId) => {
  
    try {
      const res = await axios.get(`${baseUrl}/api/subsubcategory/subcategory/${subCatId}`);
      setSubSubCategories(res.data);
      setShowSubSubcategory(true);
    } catch (err) {
      console.log("Sub-subcategory fetch failed:", err);
    }
  };

  const handleBackToCategories = () => {
    setShowSubcategory(false);
    setShowSubSubcategory(false);
  };

  const handleBackToSubcategories = () => {
    setShowSubSubcategory(false);
  };

  return (
    <div className="home">
      <div className="homeBackground">
        <div className="homeHeadderBody">
          <div className="homeHeadder">
            <p className="bannerTitle1">Welcome to online shopping</p>
          </div>
          <button onClick={logoutButton}>Logout</button>
        </div>

        <div className="homeBanner">
          <AutoSlider />
        </div>

        <div className="category">
          <div className="subCategory">
            {/* Category List */}
            {!showSubcategory &&
              category.map((item, index) => (
                <div key={index} className="categoryCard">
                  <img
                    onClick={() => handleCategoryClick(item.id)}
                    src={`${baseUrl}${item.image_url}`}
                    alt=""
                    className="categoryImage"
                  />
                  <p className="categoryDetails">{item.name}</p>
                </div>
              ))}

            {/* Subcategory List */}
            {showSubcategory && !showSubSubcategory && (
              <>
                <button className="" onClick={handleBackToCategories}>← Back to Categories</button>
                {subCategories.map((item, index) => (
                  <div key={index} className="categoryCard">
                    <img
                      onClick={() => handleSubCategoryClick(item.subcategory_id)}
                      src={`${baseUrl}${item.image_url}`}
                      alt=""
                      className="categoryImage"
                    />
                    <p className="categoryDetails">{item.subcategory_name}</p>
                  </div>
                ))}
              </>
            )}

            {/* Sub-subcategory List */}
            {showSubSubcategory && (
              <>
                <button onClick={handleBackToSubcategories}>← Back to Subcategories</button>
                {subSubCategories.length > 0 ? (
                  subSubCategories.map((item, index) => (
                    <div key={index} className="categoryCard">
                      <img
                        src={`${baseUrl}${item.image_url}`}
                        alt=""
                        className="categoryImage"
                      />
                      <p className="categoryDetails">{item.subsubcategory_name}</p>
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                  ))
                ) : (
                  <p>No sub-subcategories available.</p>
                )}
              </>
            )}
          </div>
        </div>

        <div className="products">
          <div className="subProducts">
            {products.map((item, index) => (
              <div key={index} className="productCard">
              
                <img
                  src={item.image_url}
                  alt=""
                  className="productImage"
                />
                <p className="categoryDetails">{item.name}</p>
                <p>{item.price}</p>
                {setViewMoreDetails(item)}
                <button onClick={()=>{navigate("/home/viewmore")}}>ViewMore</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
