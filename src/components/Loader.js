import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../assets/loader.json';

const Loader = ({ className }) => (
  <div className={`loader ${className}`}>
    <Lottie animationData={animationData} loop={true} />
  </div>
);

export default Loader;
