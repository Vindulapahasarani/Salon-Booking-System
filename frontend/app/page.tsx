import React from "react";
import Home from "@/components/Home/Home";
import AboutUs from "@/components/About Us/Aboutus";
import Services from "@/components/Services/Services";
import Booking from "@/components/Booking/Booking";
import Contact from "@/components/Contact/Contact";

const HomePage = () => {
  return ( 
    <div>
      <section id="home" className="section">
        <Home />
      </section>
      
      <section id="about" className="section">
        <AboutUs />
      </section>

      <section id="services" className="section">
        <Services />
      </section>

      <section id="booking" className="section">
        <Booking />
      </section>

      <section id="contact" className="section">
        <Contact />
      </section>
    </div>
  );
};

export default HomePage;
