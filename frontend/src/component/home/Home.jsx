import React from "react";
import "./home.css";
import banner1 from "../../images/banner/shoppbanner.png";
import beauty from "../../images/banner/beauty.png";
import cloths from "../../images/banner/Clothing.png";
import Furniture from "../../images/banner/Furniture1.png";
import stationery from "../../images/banner/Stationery (1).png";
import toys from "../../images/banner/toys.png";

import AutoSlider from "./AutoSlider";
const Home = () => {
  return (
    <div className="home">
      <div className="homeBody"></div>
      <div className="homeBackground">
        <div className="homeHeadderBody">
          <div className="homeHeadder">
            <p className="bannerTitle1">Welcome to online shopping</p>
          </div>
        </div>
        <div className="homeBanner">
          <div className="banner1">
            <AutoSlider />
          </div>
        </div>
        <div className="category">
          <div className="subCategory">
            <div className="categoryCard">
              <img src={beauty} className="categoryImage" />
              <p className="categoryDetails">Beauty</p>
            </div>
            <div className="categoryCard">
              <img src={cloths} className="categoryImage" />
              <p className="categoryDetails">Cloths</p>
            </div>
            <div className="categoryCard">
              <img src={Furniture} className="categoryImage" />
              <p className="categoryDetails">Furniture</p>
            </div>
            <div className="categoryCard">
              <img src={toys} className="categoryImage" />
              <p className="categoryDetails">Toys</p>
            </div>
            <div className="categoryCard">
              <img src={stationery} className="categoryImage" />
              <p className="categoryDetails">stationery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
