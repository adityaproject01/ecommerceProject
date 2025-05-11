import React, { useEffect, useState } from "react";
import homecss from "./home.module.css";
import AutoSlider from "./AutoSlider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import cartIocn from "../../images/banner/carticon1.png";
import profile from "../../images/banner/profile.png";
const Home = ({ setViewMoreDetails, totalCartCount }) => {
  const token = localStorage.getItem("token");

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
  }, [totalCartCount]);
  const handleCategoryClick = async (id) => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/subcategories/category/${id}`
      );
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
      const res = await axios.get(
        `${baseUrl}/api/subsubcategory/subcategory/${subCatId}`
      );
      setSubSubCategories(res.data);
      setShowSubSubcategory(true);
      setShowSubSubSubcategory(false);
    } catch (err) {
      console.log("Sub-subcategory fetch failed:", err);
    }
  };

  const handleSubSubCategoryClick = async (subSubCatId) => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/subsubsubcategory/subsubcategory/${subSubCatId}`
      );
      setSubSubSubCategories(res.data);
      setShowSubSubSubcategory(true);
    } catch (err) {
      console.log("Sub-sub-subcategory fetch failed:", err);
    }
  };
  const handleUserVm = (itemId) => {
    const selectedItem = products.find((product) => product.id === itemId);

    if (selectedItem) {
      setViewMoreDetails(selectedItem);
      navigate("/home/viewmore");
    }
  };

  // Navigation handlers
  const handleBackToCategories = () => {
    setShowSubcategory(false);
    setShowSubSubcategory(false);
    setShowSubSubSubcategory(false);
  };

  const logoutButton = () => {
    localStorage.removeItem("token");
    navigate("/home");
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
            <div className={homecss.homeHeaderLeft}>
              <p>Welcome to online shopping</p>
            </div>
            <div className={homecss.homeHeaderRight}>
              <div className={homecss.cartImg}>
                <img
                  onClick={() => {
                    navigate("/home/cart");
                  }}
                  src={cartIocn}
                />
                <p className={homecss.cartCnt}>{totalCartCount}</p>
              </div>
              <img src={profile} width={"50px"} />
              <button className={homecss.Logout} onClick={logoutButton}>
                Logout
              </button>
            </div>
            {/* <div className={homecss.bannerTitle1}>

            </div>
            <div className={homecss.cartIcon}>

            
            </div> */}
          </div>
        </div>
        <div className={homecss.homeBanner}>
          <AutoSlider />
        </div>
        {/* category */}
        <div className={homecss.category}>
          <div className={homecss.subCategory}>
            {/* Categories */}
            {!showSubcategory && (
              <div className={homecss.categoryContainer}>
                {category.map((item, index) => (
                  <div
                    onClick={() => handleCategoryClick(item.id)}
                    key={index}
                    className={homecss.categoryCard}
                  >
                    <img
                      src={item.image_url}
                      alt=""
                      className={homecss.categoryImage}
                    />
                    <p className={homecss.categoryDetails}>{item.name}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Subcategories */}
            {showSubcategory && !showSubSubcategory && (
              <div className={homecss.subCat}>
                <div className={homecss.categoryContainer}>
                  <button
                    className={homecss.backButton}
                    onClick={handleBackToCategories}
                  >
                    ← Back
                  </button>
                  {subCategories.map((item, index) => (
                    <div
                      onClick={() =>
                        handleSubCategoryClick(item.subcategory_id)
                      }
                      key={index}
                      className={homecss.categoryCard}
                    >
                      <img
                        src={item.image_url}
                        alt=""
                        className={homecss.categoryImage}
                      />
                      <p className={homecss.categoryDetails}>
                        {item.subcategory_name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-subcategories */}
            {showSubSubcategory && !showSubSubSubcategory && (
              <div className={homecss.subCat}>
                {subSubCategories.length > 0 ? (
                  <div className={homecss.categoryContainer}>
                    <button
                      className={homecss.backButton}
                      onClick={handleBackToSubcategories}
                    >
                      ← Back
                    </button>
                    {subSubCategories.map((item, index) => (
                      <div
                        key={index}
                        onClick={() =>
                          handleSubSubCategoryClick(item.subsub_id)
                        }
                        className={homecss.categoryCard}
                      >
                        <img
                          src={`${baseUrl}${item.image_url}`}
                          alt=""
                          className={homecss.categoryImage}
                        />
                        <p className={homecss.categoryDetails}>
                          {item.subsub_name}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>
                    <button
                      className={homecss.backButton}
                      onClick={handleBackToCategories}
                    >
                      ← Back
                    </button>
                    No product available, Right Now.
                  </p>
                )}
              </div>
            )}

            {/* Sub-sub-subcategories */}
            {showSubSubSubcategory && (
              <div className={homecss.subCat}>
                {subSubSubCategories.length > 0 ? (
                  <div className={homecss.categoryContainer}>
                    <button
                      className={homecss.backButton}
                      onClick={handleBackToSubSubcategories}
                    >
                      ← Back
                    </button>
                    {subSubSubCategories.map((item, index) => (
                      <div key={index} className={homecss.categoryCard}>
                        <img
                          src={`${baseUrl}${item.image_url}`}
                          alt={item.name}
                          className={homecss.categoryImage}
                        />
                        <p className={homecss.categoryDetails}>{item.name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>
                    <button
                      className={homecss.backButton}
                      onClick={handleBackToSubSubcategories}
                    >
                      ← Back
                    </button>
                    No product available Right Now.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div className={homecss.products}>
          {products.map((item, index) => (
            <div key={index} className={homecss.subProducts}>
              <div className={homecss.productImageCard}>
                <img
                  src={item.image_url}
                  alt=""
                  className={homecss.productImage}
                />
              </div>
              <p className={homecss.productDetailsName}>{item.name}</p>
              <div className={homecss.productCardPrice}>
                <b>
                  <p className={homecss.price}>Price {item.price}</p>
                </b>

                <button
                  className={homecss.viewMorebtn}
                  onClick={() => {
                    handleUserVm(item.id);
                  }}
                >
                  ViewMore
                </button>
              </div>
            </div>
          ))}
        </div>
        <nav aria-label="pagination">
          <ul className={homecss.pagination}>
            <li>
              <div className={homecss.paginationLink}>
                <span aria-hidden="true">&laquo;</span>
                <span className={homecss.visuallyhidden}>
                  previous set of pages
                </span>
              </div>
            </li>
            <li>
              <div className={homecss.paginationLink}>
                <span className={homecss.visuallyhidden}>page </span>1
              </div>
            </li>
            <li>
              <div className={homecss.paginationLink}>
                <span className={homecss.visuallyhidden}>page </span>2
              </div>
            </li>
            <li>
              <div className={homecss.paginationLink}>
                {" "}
                <span className={homecss.visuallyhidden}>page </span>3{" "}
              </div>
            </li>
            <li>
              <div className={homecss.paginationLink}>
                {" "}
                <span className={homecss.visuallyhidden}>page </span>4{" "}
              </div>
            </li>
            <li>
              <div className={homecss.paginationLink}>
                <span className={homecss.visuallyhidden}>
                  next set of pages
                </span>
                <span aria-hidden="true">&raquo;</span>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Home;
