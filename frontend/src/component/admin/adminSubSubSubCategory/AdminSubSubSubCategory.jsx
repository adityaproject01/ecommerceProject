import React, { useEffect, useState, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./adminSubSubSubCat.css";
import axios from "axios";

const AdminSubSubSubCategory = () => {
  const navigate = useNavigate();
  const [isSetOpen, setIsSetOpen] = useState(false);
  const [name, setName] = useState("");
  const [categoryMain, setCategoryMain] = useState("");
  const [subcategoryId, setSubCategoryId] = useState("");
  const [subSubCategoryId, setSubSubCategoryId] = useState("");
  const [images, setImages] = useState("");
  const token = localStorage.getItem("token");

  const [getCategoryDetails, setGetCategoryDetails] = useState([]);
  const [getSubCategoryDetails, setGetSubCategoryDetails] = useState([]);
  const [getSubSubCategoryDetails, setGetSubSubCategoryDetails] = useState([]);

  // Ref for file input
  const fileInputRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/category")
      .then((response) => setGetCategoryDetails(response.data))
      .catch((error) => console.log("Fetch category error", error));
  }, []);

  useEffect(() => {
    if (categoryMain) fetchSubCategories(categoryMain);
  }, [categoryMain]);

  useEffect(() => {
    if (subcategoryId) fetchSubSubCategories(subcategoryId);
  }, [subcategoryId]);

  const fetchSubCategories = (categoryId) => {
    axios
      .get(`http://localhost:5000/api/subcategory/category/${categoryId}`)
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

  const handleSubSubSubCatDetails = async (e) => {
    e.preventDefault();
    const subSubIdInt = parseInt(subSubCategoryId);
    if (!name || !subSubIdInt || !images) {
      alert("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("sub_subcategory_id", subSubIdInt);
    formData.append("image", images);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/subsubsubcategory/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        }
      );
      alert("SubSubSubCategory added successfully");
      closeModal();
    } catch (error) {
      console.log("SubSubSubCategory error", error);
    }
  };

  const closeModal = () => {
    setIsSetOpen(false);
    setName("");
    setCategoryMain("");
    setSubCategoryId("");
    setSubSubCategoryId("");
    setImages("");
    setGetSubCategoryDetails([]);
    setGetSubSubCategoryDetails([]);
    if (fileInputRef.current) fileInputRef.current.value = ""; // Clear the file input
  };

  return (
    <div className="adminSubcat">
      <div className="adminSubCatNav">
        <button onClick={() => navigate("/admin")}>Home</button>
        <button onClick={() => setIsSetOpen(true)}>
          Add SubSubSubCategory
        </button>
      </div>

      <div>
        <Outlet />
        {isSetOpen && (
          <div className="adminsubcatModal">
            <div className="adminsubcatModalNav">
              <button onClick={closeModal}>Close</button>
            </div>
            <div className="adminsubcatModalBody">
              <form onSubmit={handleSubSubSubCatDetails}>
                <div className="adminsubcatModalBodyInput">
                  <label>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="adminsubcatModalBodyInput">
                  <label>Category</label>
                  <select
                    value={categoryMain}
                    onChange={(e) => setCategoryMain(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {getCategoryDetails.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="adminsubcatModalBodyInput">
                  <label>SubCategory</label>
                  <select
                    value={subcategoryId}
                    onChange={(e) => setSubCategoryId(e.target.value)}
                  >
                    <option value="" disabled>
                      Select SubCategory
                    </option>
                    {getSubCategoryDetails.map((subCat) => (
                      <option
                        key={subCat.subcategory_id}
                        value={subCat.subcategory_id}
                      >
                        {subCat.subcategory_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="adminsubcatModalBodyInput">
                  <label>SubSubCategory</label>
                  <select
                    value={subSubCategoryId}
                    onChange={(e) =>
                      setSubSubCategoryId(e.target.value)
                    }
                  >
                    <option value="" disabled>
                      Select SubSubCategory
                    </option>
                    {getSubSubCategoryDetails.map((subsub) => (
                      <option key={subsub.subsub_id} value={subsub.subsub_id}>
                        {subsub.subsub_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="adminsubcatModalBodyInput">
                  <label>Image</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={(e) => setImages(e.target.files[0])}
                  />
                </div>

                <div className="adminsubcatModalBodyInput">
                  <button type="submit">Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSubSubSubCategory;
