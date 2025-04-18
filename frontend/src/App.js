import "./App.css";
import Home from "./component/home/Home";
import LoginPage from "./component/login/LoginPage";
import Seller from "./component/seller/Seller";
import ProtectedRoute from "./ProtectedRoute";
import Product from "./component/seller/SellerProduct";
import Register from "./component/register/Register";
import Admin from "./component/admin/Admin";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminCategory from "./component/admin/adminCategory/AdminCategory";
import AdminSubCategory from "./component/admin/adminSubCategory/AdminSubCategory";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute element={<Home />} allowedRoles={["customer"]} />
          }
        />
        <Route
          path="/seller"
          element={
            <ProtectedRoute element={<Seller />} allowedRoles={["seller"]} />
          }
        />

        <Route
          path="/seller/product"
          element={
            <ProtectedRoute element={<Product />} allowedRoles={["seller"]} />
          }
        />

        <Route path="/register" element={<Register />} />

        <Route path="*" element={<Navigate to="/" />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute element={<Admin />} allowedRoles={["admin"]} />
          }
        />
        <Route
          path="/admin/admincategory"
          element={
            <ProtectedRoute
              element={<AdminCategory />}
              allowedRoles={["admin"]}
            />
          }
        />

        <Route
          path="/admin/adminsubcategory"
          element={
            <ProtectedRoute
              element={<AdminSubCategory />}
              allowedRoles={["admin"]}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
