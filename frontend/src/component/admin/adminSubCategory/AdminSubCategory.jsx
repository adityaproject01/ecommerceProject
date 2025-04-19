import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./adminSubcategory.css";
import axios from "axios";
const AdminSubCategory = () => {
  const navigate = useNavigate();
  const [isSetOpen, setIsSetOpen] = useState(false);
  const [name, setName] = useState("");
  const [categoryMain, setCategoryMain] = useState("");
  const [images, setImages] = useState("");
  const token = localStorage.getItem("token");
    const [getCategoryDetails, setGetCategoryDetails] = useState([]);
  
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/category")
      .then((response) => {
        setGetCategoryDetails(response.data);
      })
      .catch((error) => {
        console.log("Fetch category error", error);
      });
    }, []);
  const handleSubCatDetails = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category_id", categoryMain);
    formData.append("image", images);
   
    try {
      const response = await axios.post(
        "http://localhost:5000/subcategories/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        }
      );
      alert("Product added successfull");
      console.log(response.data)
      closeModal()
    } catch (error) {
      console.log(error, "error");
    }
  };
  const closeModal = () => {
    setIsSetOpen(false);
    setName("");
    setCategoryMain("");
    setImages("");
  };
  return (
    <div className="adminSubcat">
      <div className="adminSubCatNav">
        <button onClick={() => navigate("/admin")}>Home </button>
        <button onClick={() => setIsSetOpen(true)}>AddSubCategory</button>
      </div>
      <div>
        <Outlet />
        {isSetOpen ? (
          <div className="adminsubcatModal">
            <div className="adminsubcatModalNav">
              <button
                onClick={() => {
                  setIsSetOpen(false);
                }}
              >
                Close
              </button>
            </div>
            <div className="adminsubcatModalBody">
              <form onSubmit={handleSubCatDetails}>
                <div className="adminsubcatModalBodyInput">
                  <label>Name</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <div className="adminsubcatModalBodyInput">
                
                      <label>Category</label>
                      <select
                        onChange={(e) => setCategoryMain(e.target.value)}
                      >
                        <option selected disabled>Select Category</option>
                        {getCategoryDetails.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                  
                </div>

                <div className="adminsubcatModalBodyInput">
                  <label></label>
                  <input
                    onChange={(e) => {
                      setImages(e.target.files[0]);
                    }}
                    type="file"
                  />
                </div>

                <div className="adminsubcatModalBodyInput">
                  <button type="submit">submit</button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default AdminSubCategory;
