import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollTop";

import Home from "./pages/Home";
import About from "./pages/About";
import Work from "./pages/Work";
import Services from "./pages/Services";
import International from "./pages/International";
import RentalEquipment from "./pages/Rental-equipment";
import Contact from "./pages/Contact";

function App() {
  return (
    <>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/work" element={<Work />} />
      <Route path="/services" element={<Services />} />
      <Route path="/international_support" element={<International />} />
        <Route path="/rental-equipment" element={<RentalEquipment />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
    </>
  );
}

export default App;