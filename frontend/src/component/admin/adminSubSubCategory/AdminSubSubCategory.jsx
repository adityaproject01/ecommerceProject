import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import adminSubSubCatCss from "./adminSubSubCategory.module.css";
import axios from "axios";
const AdminSubSubCategory = () => {
  const navigate = useNavigate();
  const [isSubCatEditOpen, setIsSubCatEditOpen] = useState(false);
  const [isSetOpen, setIsSetOpen] = useState(false);
  const [name, setName] = useState("");
  const [subCatId, setSubCatId] = useState("");
  const [categoryMain, setCategoryMain] = useState("");
  const [images, setImages] = useState("");
  const token = localStorage.getItem("token");

  const [subSubCatEditName, setSubSubCatEditName] = useState();

  const [subCatEditImg, setSubCatEditImg] = useState();
  const [catGetName, setCatGetName] = useState();
  const [getSubCatName, setGetSubCatName] = useState();
  const [getSubSubCatName, setGetSubSubCatName] = useState();

  const [editSubCategoryId, setEditSubCategoryId] = useState("");
  // set details
  const [subcategoryId, setSubCategoryId] = useState("");
  const [subCatSelRes, setSubCatSelRes] = useState([]);
  //details fetch
  const [getCategoryDetails, setGetCategoryDetails] = useState([]);
  const [getSubCategoryDetails, setSubGetCategoryDetails] = useState([]);
  const [getSubSubCategoryDetails, setSubSubGetCategoryDetails] = useState([]);
  const fetchSubCategories = async () => {
    try {
      const responsubsubsubcat = await axios.get(
        "http://localhost:5000/api/subsubcategory"
      );
      const responseSubCat = await axios.get(
        "http://localhost:5000/api/subcategories"
      );
      const responseCat = await axios.get(
        "http://localhost:5000/api/category",
        {
          headers: { Authorization: token },
        }
      );

      setGetCategoryDetails(responseCat.data);
      setSubGetCategoryDetails(responseSubCat.data);
      console.log(getSubSubCategoryDetails, "getSubSubCategoryDetails");
      setSubSubGetCategoryDetails(responsubsubsubcat.data);
    } catch (error) {
      console.log("Fetch category error", error);
    }
  };
  useEffect(() => {
    if (categoryMain) {
      handleSeletedSub(categoryMain);
    }
    fetchSubCategories();
  }, [token, categoryMain]);
  // selected category
  const handleSeletedSub = async (categoryMain) => {
    try {
      const CatId = parseInt(categoryMain);
      const responseSelSubCat = await axios.get(
        `http://localhost:5000/api/subcategories/category/${CatId}`,
        {
          headers: { Authorization: token },
        }
      );
      setSubCatSelRes(responseSelSubCat.data);
    } catch (error) {
      console.log("error select sub", error);
    }
  };
  //add subsubcat
  const handleSubSubCatDetails = async (e) => {
    e.preventDefault();
    const subcategoryIdNum = parseInt(subcategoryId);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", images);
    formData.append("subcategory_id", subcategoryIdNum);
    try {
      await axios.post(
        "http://localhost:5000/api/subsubcategory/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        }
      );
      alert("Product added successfull");
      fetchSubCategories();
      closeModal();
    } catch (error) {
      console.log("error add product", error);
    }
  };

  // subcat edit
  const handleEditSubCat = async () => {
    const finalCategoryId =
      editSubCategoryId ||
      getCategoryDetails.find((cat) => cat.name === catGetName)?.id;

    const catId = parseInt(finalCategoryId);
    const formData = new FormData();
    formData.append("name", subSubCatEditName);
    formData.append("category_id", catId);
    if (subCatEditImg) {
      formData.append("image", subCatEditImg);
    }
    const subCatIdNum = parseInt(subCatId);
    try {
      await axios.put(
        `http://localhost:5000/api/subcategories/${subCatIdNum}`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      fetchSubCategories();
      setIsSubCatEditOpen(false);
    } catch (error) {
      console.log("catEditError", error);
    }
  };

  const handleEditClick = (id, subid) => {
    const subCat = getSubCategoryDetails.find(
      (item) => item.subcategory_id === id
    );
    const subSubCat = getSubSubCategoryDetails.find(
      (item) => item.subsub_id === subid
    );
    console.log(getSubSubCategoryDetails, "subsub_id");
    console.log(subCat, "subCat");
    if (subCat) {
      setSubCatId(id);

      setSubSubCatEditName(subCat.subcategory_name);
      setCatGetName(subCat.category_name);
      setGetSubCatName(subCat.subcategory_name);
      setGetSubSubCatName(subSubCat.subsub_name);
      setSubCatEditImg(null);
      setIsSubCatEditOpen(true);
    }
  };
  // delete

  const handleDeleteCat = async (subCatDelId) => {
    const catDelIdNum = parseInt(subCatDelId);
    try {
      await axios.delete(
        `http://localhost:5000/api/subcategories/${catDelIdNum}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      fetchSubCategories();
      // setSuCategoryDetails(res.data);
    } catch (error) {
      console.log("error delete category", error);
    }
  };
  const closeModal = () => {
    setIsSetOpen(false);
    setName("");
    setCategoryMain("");
    setImages("");
  };
  const logoutButton = () => {
    localStorage.removeItem("token");
    navigate("/home");
  };

  return (
    <div className={adminSubSubCatCss.adminContainer}>
      <div className={adminSubSubCatCss.glassNavbar}>
        <button
          className={adminSubSubCatCss.navBtn}
          onClick={() => navigate("/admin")}
        >
          Home{" "}
        </button>
        <div className={adminSubSubCatCss.navTitle}>Welcome, Admin</div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            className={`${adminSubSubCatCss.navBtn} ${adminSubSubCatCss.addBtn}`}
            onClick={() => setIsSetOpen(true)}
          >
            AddSubSubCategory
          </button>
          <button
            onClick={logoutButton}
            className={`${adminSubSubCatCss.navBtn} ${adminSubSubCatCss.logout}`}
          >
            🔓 Logout
          </button>
        </div>
      </div>
      <h2 className={adminSubSubCatCss.glassHeader}>
        Manage Sub-Sub-Categories
      </h2>

      <Outlet />
      {isSetOpen ? (
        <div className={adminSubSubCatCss.modalBackdrop}>
          <div
            className={`${adminSubSubCatCss.modalContainer} ${adminSubSubCatCss.glassCard}`}
          >
            <h3>Add Sub Sub Category</h3>

            <form onSubmit={handleSubSubCatDetails}>
              <label>Name</label>
              <input
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />

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
              <label>SubCategory</label>

              <select onChange={(e) => setSubCategoryId(e.target.value)}>
                <option selected disabled>
                  Select Sub Category
                </option>
                {subCatSelRes?.map((subCatSel, index) => (
                  <option key={index} value={subCatSel.subcategory_id}>
                    {subCatSel.subcategory_name}
                  </option>
                ))}
              </select>
              <label>Image</label>
              <input
                onChange={(e) => {
                  setImages(e.target.files[0]);
                }}
                type="file"
              />

              <button type="submit" className={adminSubSubCatCss.saveBtn}>
                submit
              </button>
              <button
                type="button"
                className={adminSubSubCatCss.cancelBtn}
                onClick={() => {
                  setIsSetOpen(false);
                }}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      ) : (
        <></>
      )}

      <div
        className={`${adminSubSubCatCss.tableHeader} ${adminSubSubCatCss.glassRow}`}
      >
        <div>ID</div>
        <div>SubName</div>
        <div>Image</div>
        <div>Actions</div>
      </div>
      {/* ftchsubcat */}
      {getSubSubCategoryDetails.map((item, index) => (
        <div className={adminSubSubCatCss.glassRow} key={index}>
          <div>{index + 1}</div>
          <div>{item.subsub_name}</div>

          <div>
            <img
              src={`http://localhost:5000${item.image_url}`}
              alt="loading"
              className={adminSubSubCatCss.rowImage}
            />
          </div>
          <div className={adminSubSubCatCss.catActions}>
            <button
              onClick={() =>
                handleEditClick(item.subcategory_id, item.subsub_id)
              }
              className={adminSubSubCatCss.editBtn}
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteCat(item.subcategory_id)}
              className={adminSubSubCatCss.deleteBtn}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      {isSubCatEditOpen && (
        <div className={adminSubSubCatCss.modalBackdrop}>
          <div
            className={`${adminSubSubCatCss.modalContainer} ${adminSubSubCatCss.glassCard}`}
          >
            <h3>Edit Sub-SubCategory</h3>
            <form
              onSubmit={(e) => {
                handleEditSubCat();
                e.preventDefault();
              }}
            >
              <label> Category Name:</label>
              <input
                className={adminSubSubCatCss.selNone}
                value={catGetName}
                disabled
              />

              <label>Sub Category Name:</label>
              <input
                disabled
                className={adminSubSubCatCss.selNone}
                value={getSubCatName}
                onChange={(e) => setEditSubCategoryId(e.target.value)}
              />

              <label>Sub Sub Category Name:</label>
              <input
                type="text"
                value={getSubSubCatName}
                onChange={(e) => setGetSubSubCatName(e.target.value)}
              />
              <label>New Image (optional):</label>
              <input
                type="file"
                onChange={(e) => setSubCatEditImg(e.target.files[0])}
              />
              <div className={adminSubSubCatCss.modalActions}>
                <button type="submit" className={adminSubSubCatCss.saveBtn}>
                  Save
                </button>
                <button
                  type="button"
                  className={adminSubSubCatCss.cancelBtn}
                  onClick={() => {
                    setIsSubCatEditOpen(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubSubCategory;
