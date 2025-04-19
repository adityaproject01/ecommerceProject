import React, { useEffect, useState } from "react";
import "./home.css";
import AutoSlider from "./AutoSlider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);

  const [catId, setCatId] = useState("");
  const [subCatId, setSubCatId] = useState("");

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

  useEffect(() => {
    if (catId) {
      axios
        .get(`${baseUrl}/api/subcategory/category/${catId}`)
        .then((res) => {
          setSubCategories(res.data);
          setShowSubcategory(true);
          setShowSubSubcategory(false);
        });
    }
  }, [catId]);

  useEffect(() => {
    if (subCatId) {
      axios
        .get(`${baseUrl}/api/subsubcategory/subcategory/${subCatId}`)
        .then((res) => {
          setSubSubCategories(res.data);
          setShowSubSubcategory(true);
        });
    }
  }, [subCatId]);

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

            {/* Category Level */}
            {!showSubcategory &&
              category.map((item, index) => (
                <div key={index} className="categoryCard">
                  <img
                    onClick={() => {
                      setCatId(item.id);
                    }}
                    src={`${baseUrl}${item.image_url}`}
                    alt=""
                    className="categoryImage"
                  />
                  <p className="categoryDetails">{item.name}</p>
                </div>
              ))}

            {/* Subcategory Level */}
            {showSubcategory && !showSubSubcategory &&
              subCategories.map((item, index) => (
                <div key={index} className="categoryCard">
                  <img
                    onClick={() => {
                      setSubCatId(item.id);
                    }}
                    src={`${baseUrl}${item.image_url}`}
                    alt=""
                    className="categoryImage"
                  />
                  <p className="categoryDetails">{item.subcategory_name}</p>
                </div>
              ))}

            {/* Sub-Subcategory Level */}
            {showSubSubcategory &&
              subSubCategories.map((item, index) => (
                <div key={index} className="categoryCard">
                  <p>d</p>
                </div>
              )
              
              )}

          </div>
        </div>

        <div className="products">
          <div className="subProducts">
            {products.map((item, index) => (
              <div key={index} className="productCard">
                <img
                  src={`${baseUrl}/${item.image_url}`}
                  alt=""
                  className="productImage"
                />
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
