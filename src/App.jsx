import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Home from './pages/home';
import Shop from './pages/shop'; 
import SingleProduct from './pages/SingleProduct';

// Simple temporary placeholders for remaining pages so they don't break
const About = () => <div className="p-12 text-center text-xl font-bold text-[#03045e]">About Us Page Coming Soon!</div>;
const Contact = () => <div className="p-12 text-center text-xl font-bold text-[#03045e]">Contact Page Coming Soon!</div>;

function App() {
  return (
    <>
      {/* Navbar stays active globally across all routes */}
      <Navbar /> 
      
      {/* Route Switcher */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* CRITICAL FIX: Yahan humne ':' (colon) ke sath 'id' add kiya hai.
          Ab jab bhi koi browser mein '/product/1' ya '/product/2' par jayega, 
          toh SingleProduct page sahi se load ho jayega!
        */}
        <Route path="/product/:id" element={<SingleProduct />} />
      </Routes>
    </>
  );
}

export default App;