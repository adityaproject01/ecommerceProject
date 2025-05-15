import React from 'react';
import { useNavigate } from 'react-router-dom';
import adminCss from './admin.module.css';

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className={adminCss.dashboard}>
      {/* Sidebar */}
      <div className={adminCss.sidebar}>
        <div className={adminCss.logo}>AdminHub</div>
        <nav className={adminCss.nav}>
          <button onClick={() => navigate('/admin/dashboard')}> Dashboard</button>
          <button onClick={() => navigate('/admin/admincategory')}> Categories</button>
          <button onClick={() => navigate('/admin/adminsubcategory')}> Subcategories</button>
          <button onClick={() => navigate('/admin/adminproducts')}> Products</button>
          <button onClick={() => navigate('/admin/adminusers')}> Users</button>
        </nav>
      </div>

      {/* Main Content */}
      <div className={adminCss.content}>
        <header className={adminCss.header}>
          <h1>Admin Dashboard</h1>
          <div className={adminCss.profile}>
            <span className={adminCss.userName}>Welcome, Admin</span>
            <div className={adminCss.profilePic}></div>
          </div>
        </header>

        <section className={adminCss.stats}>
          <div className={adminCss.card}>Total Users: 1340</div>
          <div className={adminCss.card}>Total Products: 328</div>
          <div className={adminCss.card}>Orders Processed: 214</div>
          <div className={adminCss.card}>Categories: 18</div>
        </section>

        {/* Activity Feed */}
        <section className={adminCss.activity}>
          <h3>Recent Activity</h3>
          <ul>
            <li>User 'JohnDoe' registered</li>
            <li>Product 'iPhone 13' added</li>
            <li>Category 'Electronics' updated</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Admin;
