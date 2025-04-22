import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./adminSubSubCategory.css";
import axios from "axios";
const AdminSubSubCategory = () => {
  const navigate = useNavigate();
  const [isSetOpen, setIsSetOpen] = useState(false);
  const [name, setName] = useState("");
  const [categoryMain, setCategoryMain] = useState("");
  const [subcategoryId, setSubCategoryId] = useState("");
  const [images, setImages] = useState("");
  const token = localStorage.getItem("token");
  const [getCategoryDetails, setGetCategoryDetails] = useState([]);
  const [getSubCategoryDetails, setGetSubCategoryDetails] = useState([]);
//   const [getSubSubCategoryDetails, setGetSubSubCategoryDetails] = useState([]);

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
  useEffect(() => {
    if (categoryMain) {
      fetchSubCategories(categoryMain);
    }
    // if (subcategoryId) {
    //   fetchSubSubCategories(subcategoryId);
    // }
  }, [categoryMain]);
  const handleSubSubCatDetails = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", images);
    formData.append("subcategory_id",subcategoryId)
    console.log(images,"images")
    try {
      const response = await axios.post(
        "http://localhost:5000/api/subsubcategory/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        }
      );
      alert("subsubcategory added successfull");
      console.log(response.data);
      closeModal();
    } catch (error) {
      console.log("subsubcategory error",error);
    }
  };
  const fetchSubCategories = (categoryId) => {
    if (categoryId) {
      axios
        .get(`http://localhost:5000/api/subcategory/category/${categoryId}`)
        .then((res) => {
          setGetSubCategoryDetails(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch subcategories", err);
          setGetSubCategoryDetails([]);
        });
    }
  };
  const closeModal = () => {
    setIsSetOpen(false);
    setName("");
    setCategoryMain("");
    setImages("");
  };
//   const fetchSubSubCategories = (subcategoryId) => {
//     if (subcategoryId) {
//       axios
//         .get(
//           `http://localhost:5000/api/subsubcategory/subcategory/${subcategoryId}`
//         )
//         .then((res) => {
//           setGetSubSubCategoryDetails(res.data);
//         })
//         .catch((err) => {
//           console.error("Failed to fetch subcategories", err);
//           setGetSubSubCategoryDetails([]);
//         });
//     }
//   };
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
              <form onSubmit={handleSubSubCatDetails}>
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
                  <select onChange={(e) => setCategoryMain(e.target.value)}>
                    <option selected disabled>
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
                  <select onChange={(e) => setSubCategoryId(e.target.value)}>
                    <option selected disabled>
                      Select Sub Category
                    </option>
                    {getSubCategoryDetails.map((subCat, index) => (
                      <option key={index} value={subCat.subcategory_id}>
                        {subCat.subcategory_name}
                        {console.log(subCat)}
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

export default AdminSubSubCategory;
