import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./adminCategory.css";
import axios from "axios";
const AdminCategory = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminCatName, setAdminCatName] = useState("");
  const [adminCatImg, setAdminCatImg] = useState("");
  const token=localStorage.getItem("token")
  const handleAdminCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", adminCatName);
    formData.append("image", adminCatImg);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/category/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        }
      );
      console.log(response,"response")
      alert("Category is added")
      closeModal()
    } catch (error) {
      console.log(error, "error");
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setAdminCatName("");
    setAdminCatImg("");
  };
  return (
    <div className="adminCategory">
      <div className="adminCatNav">
        <button onClick={() => navigate("/admin")}>Home </button>
        <p>Catgory</p>
        <button
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          Add Button
        </button>
      </div>
      <div className="adminCatBody">
        <Outlet />
        {isModalOpen ? (
          <>
            <div className="adminCatModal">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                Close
              </button>

              <div className="adminCatModalBody">
                <form onSubmit={handleAdminCategory}>
                  <div className="adminCatInput">
                    <label>Name</label>
                    <input
                      type="text"
                      onChange={(e) => {
                        setAdminCatName(e.target.value);
                      }}
                    />
                  </div>
                  <div className="adminCatInput">
                    <label>Image</label>
                    <input
                      type="file"
                      onChange={(e) => {
                        setAdminCatImg(e.target.files[0]);
                      }}
                    />
                  </div>
                  <div className="adminCatInput">
                    <button type="submit">submit</button>
                  </div>
                </form>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default AdminCategory;
