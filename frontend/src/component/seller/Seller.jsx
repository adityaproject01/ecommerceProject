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
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Form input state
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productDescription, setProductDescription] = useState("");

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  });
  const logoutButton = () => {
    localStorage.removeItem("token");
    navigate("/home");
  };
  const fetchProducts = () => {
    axios
      .get("http://localhost:5000/api/products/my-products", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setProductDetails(response.data.products);
      })
      .catch((error) => {
        console.log("Fetch error", error);
      });
    axios.get("http://localhost:5000/api/category").then((respone) => {
      setGetCategoryDetails(respone.data);
    });
  };

  // Delete a product
  const productDelete = (productId) => {
    const deleteProductUrl = `http://localhost:5000/api/products/${productId}`;

    axios
      .delete(deleteProductUrl, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log("Deleted", response.data);
        fetchProducts(); // Refresh the list after deletion
      })
      .catch((error) => {
        console.log("DeleteError", error);
      });
  };

  // Add a product
  const handleAddProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("price", productPrice);
    formData.append("category_id", productCategory);
    formData.append("description", productDescription);
    formData.append("image", productImage);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/products/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        }
      );

      console.log("Product added", response.data);
      fetchProducts(); // Refresh product list
      setIsModalOpen(false); // Close modal
      setProductName("");
      setProductPrice("");
      setProductCategory("");
      setProductImage("");
      setProductDescription("");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="seller">
      <div className="sellerNav">
        <button onClick={() => navigate("/seller/product")}>Product</button>
        <button onClick={() => setIsModalOpen(true)}>Add Product</button>
        <button onClick={() => logoutButton()}>Logout</button>
      </div>

      <div className="sellerBody">
        <div className="sellerSubBody">
          <Outlet />

          {isModalOpen && (
            <div className="overlay">
              <div className="modal drop1">
                <div className="modalNav">
                  <h2>Add Product</h2>
                  <button onClick={() => setIsModalOpen(false)}>Close</button>
                </div>
                <div className="productForm">
                  <form onSubmit={handleAddProduct}>
                    <div className="productFiled">
                      <label>Name</label>
                      <input
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                      />
                    </div>
                    <div className="productFiled">
                      <label>Price</label>
                      <input
                        type="number"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                      />
                    </div>
                    <div className="productFiled">
                      <label>Category</label>
                      <select
                        value={productCategory}
                        onChange={(e) => setProductCategory(e.target.value)}
                      >
                        <option value="" disabled>
                          Select Value
                        </option>
                        {getCategoryDetails?.map((value) => (
                          <option key={value.id} value={value.id}>
                            {value.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="productFiled">
                      <label>Image URL</label>
                      <input
                        type="file"
                        onChange={(e) => setProductImage(e.target.files[0])}
                      />
                    </div>
                    <div className="productFiled">
                      <label>Description</label>
                      <input
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                      />
                    </div>
                    <div className="productFiled">
                      <button type="submit">Submit</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Product Table */}
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
                {console.log(product)}
                <p className="productDetails">{product.category_id}</p>
                <p className="productDetails">{console.log(`http://localhost:5000/uploads/products/${product.image_url}`)}
                  <img src={product.image_url} alt="" height="50" />
                </p>
                <p className="productDetails">{product.description}</p>
                <p className="productDetails">
                  <button className="button">
                    <img src={editImg} alt="Edit" />
                  </button>
                  <button
                    className="button"
                    onClick={() => productDelete(product.id)}
                  >
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
