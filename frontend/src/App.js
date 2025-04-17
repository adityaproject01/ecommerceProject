import "./App.css";
import Home from "./component/home/Home";
import LoginPage from "./component/login/LoginPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Seller from "./component/seller/Seller";
import ProtectedRoute from "./ProtectedRoute";
import Product from "./component/seller/SellerProduct";
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

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
