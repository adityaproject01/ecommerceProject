import React from "react";
import "./admin.css";
import { Outlet, useNavigate } from "react-router-dom";
const Admin = () => {
  const navigate = useNavigate();
  return (
    <div className="adminHome">
      <div className="adminNav">
        
        <button onClick={() => navigate("/admin/admincategory")}>category </button>
        <button onClick={() => navigate("/admin/adminsubcategory")}>subcategory </button>
      </div>
      <div>

      <Outlet />
      </div>
    </div>
  );
};

export default Admin;
