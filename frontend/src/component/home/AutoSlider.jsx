import React, { useState, useEffect } from "react";
import "./home.css"
import banner1 from "../../images/banner/3826413.jpg";
import banner2 from "../../images/banner/4685339.jpg";
import banner3 from "../../images/banner/6260330.jpg";
import banner4 from "../../images/banner/banner5.png";
import banner5 from "../../images/banner/banner6.jpg";

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
    <div className="slider-container sliderContainerStyles" >
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex}`}
      />
    </div>
  );
};



export default AutoSlider;
