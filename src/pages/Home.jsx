import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Categories from "../components/Categories.jsx";
import WhyUs from "../components/WhyUs.jsx";
import PopularCars from "../components/PopularCars.jsx";
import Brands from "../components/Brands.jsx";
import StepsStats from "../components/StepsStats.jsx";
import Testimonials from "../components/Testimonials.jsx";
import Pricing from "../components/Pricing.jsx";
import Blog from "../components/Blog.jsx";
import Faq from "../components/Faq.jsx";
import Newsletter from "../components/Newsletter.jsx";
import Footer from "../components/Footer.jsx";

export default function Home() {
  const [startingPrice, setStartingPrice] = useState(null);
  const [brandCount, setBrandCount] = useState(null);

  return (
    <>
      <Navbar />
      <Hero startingPrice={startingPrice} />
      <Categories />
      <WhyUs />
      <PopularCars onPriceLoaded={setStartingPrice} />
      <Brands onCountLoaded={setBrandCount} />
      <StepsStats brandCount={brandCount} />
      <Testimonials />
      <Pricing />
      <Blog />
      <Faq />
      <Newsletter />
      <Footer />
    </>
  );
}
