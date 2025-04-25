import React, { useEffect, useState } from "react";
import homecss from './home.module.css';
import AutoSlider from "./AutoSlider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = ({ setViewMoreDetails }) => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [subSubSubCategories, setSubSubSubCategories] = useState([]);

  const [showSubcategory, setShowSubcategory] = useState(false);
  const [showSubSubcategory, setShowSubSubcategory] = useState(false);
  const [showSubSubSubcategory, setShowSubSubSubcategory] = useState(false);

  const navigate = useNavigate();
  const baseUrl = "http://localhost:5000";

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
      setShowSubSubSubcategory(false);
    } catch (err) {
      console.log("Subcategory fetch failed:", err);
    }
  };

  const handleSubCategoryClick = async (subCatId) => {
    try {
      const res = await axios.get(`${baseUrl}/api/subsubcategory/subcategory/${subCatId}`);
      setSubSubCategories(res.data);
      setShowSubSubcategory(true);
      setShowSubSubSubcategory(false);
    } catch (err) {
      console.log("Sub-subcategory fetch failed:", err);
    }
  };

  const handleSubSubCategoryClick = async (subSubCatId) => {
    try {
      const res = await axios.get(`${baseUrl}/api/subsubsubcategory/subsubcategory/${subSubCatId}`);
      setSubSubSubCategories(res.data);
      setShowSubSubSubcategory(true);
    } catch (err) {
      console.log("Sub-sub-subcategory fetch failed:", err);
    }
    console.log(subSubCatId,"subSubSubCategories")
  };

  // Navigation handlers
  const handleBackToCategories = () => {
    setShowSubcategory(false);
    setShowSubSubcategory(false);
    setShowSubSubSubcategory(false);
  };

  const handleBackToSubcategories = () => {
    setShowSubSubcategory(false);
    setShowSubSubSubcategory(false);
  };

  const handleBackToSubSubcategories = () => {
    setShowSubSubSubcategory(false);
  };

  return (
    <div className={homecss.home}>
      <div className={homecss.homeBackground}>
        <div className={homecss.homeHeadderBody}>
          <div className={homecss.homeHeadder}>
            <p className={homecss.bannerTitle1}>Welcome to online shopping</p>
          </div>
        </div>

        <div className={homecss.homeBanner}>
          <AutoSlider />
        </div>

        <div className={homecss.category}>
          <div className={homecss.subCategory}>
            {/* Categories */}
            {!showSubcategory &&
              category.map((item, index) => (
                <div key={index} className={homecss.categoryCard}>
                  <img
                    onClick={() => handleCategoryClick(item.id)}
                    src={item.image_url}
                    alt=""
                    className={homecss.categoryImage}
                  />
                  <p className={homecss.categoryDetails}>{item.name}</p>
                </div>
              ))}

            {/* Subcategories */}
            {showSubcategory && !showSubSubcategory && (
              <>
                <button onClick={handleBackToCategories}>← Back to Categories</button>
                {subCategories.map((item, index) => (
                  <div key={index} className={homecss.categoryCard}>
                    <img
                      onClick={() => handleSubCategoryClick(item.subcategory_id)}
                      src={`${baseUrl}${item.image_url}`}
                      alt=""
                      className={homecss.categoryImage}
                    />
                    <p className={homecss.categoryDetails}>{item.subcategory_name}</p>
                  </div>
                ))}
              </>
            )}

            {/* Sub-subcategories */}
            {showSubSubcategory && !showSubSubSubcategory && (
              <>
                <button onClick={handleBackToSubcategories}>← Back to Subcategories</button>
                {subSubCategories.length > 0 ? (
                  subSubCategories.map((item, index) => (
                    <div key={index} className={homecss.categoryCard}>
                
                      <img
                        onClick={() => handleSubSubCategoryClick(item.subsub_id)}
                        src={`${baseUrl}${item.image_url}`}
                        alt=""
                        className={homecss.categoryImage}
                      />
                      <p className={homecss.categoryDetails}>{item.subsub_name}</p>
                    </div>
                  ))
                ) : (
                  <p>No sub-subcategories available.</p>
                )}
              </>
            )}
            

            {/* Sub-sub-subcategories */}
            {showSubSubSubcategory && (
              <>
                <button onClick={handleBackToSubSubcategories}>← Back to Sub-subcategories</button>
                {subSubSubCategories.length > 0 ? (
                  subSubSubCategories.map((item, index) => (
                    <div key={index} className={homecss.categoryCard}>
                      
                      <img
                        src={`${baseUrl}${item.image_url}`}
                        alt={item.name}
                        className={homecss.categoryImage}
                      />
                      <p className={homecss.categoryDetails}>{item.name}</p>
                    </div>
                  ))
                ) : (
                  <p>No sub-sub-subcategories available.</p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div className={homecss.products}>
          <div className={homecss.subProducts}>
            {products.map((item, index) => (
              <div key={index} className={homecss.productCard}>
                <img
                  src={item.image_url}
                  alt=""
                  className={homecss.productImage}
                />
                <p className={homecss.productDetailsName}>{item.name}</p>
                <p>Price {item.price}</p>
                {setViewMoreDetails(item)}
                <button
                  className={homecss.viewMorebtn}
                  onClick={() => {
                    navigate("/home/viewmore");
                  }}
                >
                  ViewMore
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
