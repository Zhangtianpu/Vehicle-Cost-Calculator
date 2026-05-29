import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/layout/CookieConsent";
import CalculatorPage from "@/pages/CalculatorPage";
import ComparePage from "@/pages/ComparePage";
import FeaturesPage from "@/pages/FeaturesPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import AboutPage from "@/pages/AboutPage";
import DisclaimerPage from "@/pages/DisclaimerPage";
import ContactPage from "@/pages/ContactPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<FeaturesPage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
        <CookieConsent />
      </div>
    </Router>
  );
}
