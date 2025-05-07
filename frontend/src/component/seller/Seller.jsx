import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "./seller.css";
import axios from "axios";
import editImg from "../../images/banner/edit-button_7124470.png";
import deleteImg from "../../images/banner/delete1.png";

const Seller = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productDetails, setProductDetails] = useState([]);
  const [getCategoryDetails, setGetCategoryDetails] = useState([]);
  const [getSubCategoryDetails, setGetSubCategoryDetails] = useState([]);
  const [getSubSubCategoryDetails, setGetSubSubCategoryDetails] = useState([]);
  const [getSubSubSubCategoryDetails, setGetSubSubSubCategoryDetails] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productSubCategory, setProductSubCategory] = useState("");
  const [productSubSubCategory, setProductSubSubCategory] = useState("");
  const [productSubSubSubCategory, setProductSubSubSubCategory] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [productDescription, setProductDescription] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (productCategory) {
      fetchSubCategories(productCategory);
    } else {
      setGetSubCategoryDetails([]);
    }
  }, [productCategory]);

  useEffect(() => {
    if (productSubCategory) {
      fetchSubSubCategories(productSubCategory);
    } else {
      setGetSubSubCategoryDetails([]);
    }
  }, [productSubCategory]);

  useEffect(() => {
    if (productSubSubCategory) {
      fetchSubSubSubCategories(productSubSubCategory);
    } else {
      setGetSubSubSubCategoryDetails([]);
    }
  }, [productSubSubCategory]);

  const logoutButton = () => {
    localStorage.removeItem("token");
    navigate("/home");
  };

  const fetchProducts = () => {
    axios
      .get("http://localhost:5000/api/products/my-products", {
        headers: { Authorization: token },
      })
      .then((res) => setProductDetails(res.data.products))
      .catch((err) => console.log("Fetch my-products error", err));
  };

  const fetchCategories = () => {
    axios
      .get("http://localhost:5000/api/category")
      .then((res) => setGetCategoryDetails(res.data))
      .catch((err) => console.log("Fetch category error", err));
  };

  const fetchSubCategories = (categoryId) => {
    axios
      .get(`http://localhost:5000/api/subcategories/category/${categoryId}`)
      .then((res) => setGetSubCategoryDetails(res.data))
      .catch((err) => {
        console.error("Failed to fetch subcategories", err);
        setGetSubCategoryDetails([]);
      });
  };

  const fetchSubSubCategories = (subcategoryId) => {
    axios
      .get(`http://localhost:5000/api/subsubcategory/subcategory/${subcategoryId}`)
      .then((res) => setGetSubSubCategoryDetails(res.data))
      .catch((err) => {
        console.error("Failed to fetch sub-subcategories", err);
        setGetSubSubCategoryDetails([]);
      });
  };

  const fetchSubSubSubCategories = (subSubcategoryId) => {
    axios
      .get(`http://localhost:5000/api/subsubsubcategory/subsubcategory/${subSubcategoryId}`)
      .then((res) => setGetSubSubSubCategoryDetails(res.data))
      .catch((err) => {
        console.error("Failed to fetch sub-sub-subcategories", err);
        setGetSubSubSubCategoryDetails([]);
      });
  };

  const productDelete = (productId) => {
    axios
      .delete(`http://localhost:5000/api/products/${productId}`, {
        headers: { Authorization: token },
      })
      .then(() => fetchProducts())
      .catch((err) => console.log("DeleteError", err));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("price", productPrice);
    formData.append("sub_sub_subcategory_id", productSubSubSubCategory);
    formData.append("description", productDescription);
    formData.append("image", productImage);

    try {
      await axios.post("http://localhost:5000/api/products/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });
      fetchProducts();
      closeModal();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handlEditProduct = async (e, productId) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("price", productPrice);
    formData.append("category_id", productCategory);
    formData.append("description", productDescription);
    if (productImage) formData.append("image", productImage);

    try {
      await axios.put(`http://localhost:5000/api/products/${productId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });
      fetchProducts();
      closeModal();
    } catch (error) {
      console.log("errorEdit", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentEditId(null);
    setProductName("");
    setProductPrice("");
    setProductCategory("");
    setProductSubCategory("");
    setProductSubSubCategory("");
    setProductSubSubSubCategory("");
    setProductImage(null);
    setProductDescription("");
  };

  return (
    <div className="seller">
      <div className="sellerNav">
        <button onClick={() => navigate("/seller/product")}>Product</button>
        <button onClick={() => setIsModalOpen(true)}>Add Product</button>
        <button onClick={logoutButton}>Logout</button>
      </div>

      <div className="sellerBody">
        <div className="sellerSubBody">
          <Outlet />

          {isModalOpen && (
            <div className="overlay">
              <div className="modal drop1">
                <div className="modalNav">
                  <h2>{isEditing ? "Edit Product" : "Add Product"}</h2>
                  <button onClick={closeModal}>Close</button>
                </div>
                <div className="productForm">
                  <form onSubmit={(e) => isEditing ? handlEditProduct(e, currentEditId) : handleAddProduct(e)}>
                    <div className="productFiled">
                      <label>Name</label>
                      <input value={productName} onChange={(e) => setProductName(e.target.value)} />
                    </div>
                    <div className="productFiled">
                      <label>Price</label>
                      <input type="number" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />
                    </div>
                    <div className="productFiled">
                      <label>Category</label>
                      <select value={productCategory} onChange={(e) => setProductCategory(e.target.value)}>
                        <option value="">Select Category</option>
                        {getCategoryDetails.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="productFiled">
                      <label>SubCategory</label>
                      <select value={productSubCategory} onChange={(e) => setProductSubCategory(e.target.value)}>
                        <option value="">Select SubCategory</option>
                        {getSubCategoryDetails.map((sub) => (
                          <option key={sub.subcategory_id} value={sub.subcategory_id}>{sub.subcategory_name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="productFiled">
                      <label>SubSubCategory</label>
                      <select value={productSubSubCategory} onChange={(e) => setProductSubSubCategory(e.target.value)}>
                        <option value="">Select SubSubCategory</option>
                        {getSubSubCategoryDetails.map((sub) => (
                          <option key={sub.subsub_id} value={sub.subsub_id}>{sub.subsub_name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="productFiled">
                      <label>SubSubSubCategory</label>
                      <select value={productSubSubSubCategory} onChange={(e) => setProductSubSubSubCategory(e.target.value)}>
                        <option value="">Select SubSubSubCategory</option>
                        {getSubSubSubCategoryDetails.map((sub) => (
                          <option key={sub.id} value={sub.id}>{sub.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="productFiled">
                      <label>Image</label>
                      <input type="file" onChange={(e) => setProductImage(e.target.files[0])} />
                    </div>
                    <div className="productFiled">
                      <label>Description</label>
                      <input value={productDescription} onChange={(e) => setProductDescription(e.target.value)} />
                    </div>
                    <div className="productFiled">
                      <button type="submit">{isEditing ? "Update" : "Submit"}</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          <div className="sellerGlassCard">
            <div className="product">
              <div className="productDetails">SlNo</div>
              <div className="productDetails">Name</div>
              <div className="productDetails">Price</div>
              <div className="productDetails">Category</div>
              <div className="productDetails">Image</div>
              <div className="productDetails">Description</div>
              <div className="productDetails">Details</div>
            </div>

            {productDetails.map((product, index) => (
              <div className="product" key={index}>
                <p className="productDetails">{index + 1}</p>
                <p className="productDetails">{product.name}</p>
                <p className="productDetails">{product.price}</p>
               
                <p className="productDetails">{product.name}</p>
                <p className="productDetails">
                  <img src={product.image_url} alt="product" height="50" />
                </p>
                <p className="productDetailsDes">{product.description}</p>
                <p className="productDetails">
                  <button className="button" onClick={() => {
                    setIsModalOpen(true);
                    setIsEditing(true);
                    setCurrentEditId(product.id);
                    setProductName(product.name);
                    setProductPrice(product.price);
                    setProductCategory(product.category_id);
                    setProductSubCategory(product.subcategory_id);
                    setProductSubSubCategory(product.sub_subcategory_id);
                    setProductSubSubSubCategory(product.sub_sub_subcategory_id || "");
                    setProductDescription(product.description);
                    setProductImage(null);
                  }}>
                    <img src={editImg} alt="Edit" />
                  </button>
                  <button className="button" onClick={() => productDelete(product.id)}>
                    <img src={deleteImg} alt="Delete" />
                  </button>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seller;
