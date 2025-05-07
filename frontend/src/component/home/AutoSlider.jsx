import React, { useState, useEffect } from "react";
import homecss from './home.module.css'; 
import banner1 from "../../images/banner/bg11.png";
import banner2 from "../../images/banner/bg12.png";
import banner3 from "../../images/banner/bg16.jpg";
import banner4 from "../../images/banner/8852145.jpg";
import banner5 from "../../images/banner/8852028.jpg";

const images = [banner1, banner2, banner3, banner4,banner5];

const AutoSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); 

    return () => clearInterval(interval); 
  }, []);

  return (
    <div className={`${homecss['slider-container']} ${homecss['slider-container-styles']}`}>
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex}`}
      />
    </div>
  );
};
export default AutoSlider;
