import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/layout/CookieConsent";
import SeoManager from "@/components/layout/SeoManager";
import CalculatorPage from "@/pages/CalculatorPage";
import ComparePage from "@/pages/ComparePage";
import FeaturesPage from "@/pages/FeaturesPage";
import BlogPage from "@/pages/BlogPage";
import BlogArticlePage from "@/pages/BlogArticlePage";
import FAQPage from "@/pages/FAQPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import AboutPage from "@/pages/AboutPage";
import DisclaimerPage from "@/pages/DisclaimerPage";
import ContactPage from "@/pages/ContactPage";
import MethodologyPage from "@/pages/MethodologyPage";
import EditorialPolicyPage from "@/pages/EditorialPolicyPage";
import ToolsHubPage from "@/pages/ToolsHubPage";
import CostPerKmPage from "@/pages/CostPerKmPage";
import EvBreakEvenPage from "@/pages/EvBreakEvenPage";
import FuelCostPage from "@/pages/FuelCostPage";
import DepreciationPage from "@/pages/DepreciationPage";
import ChargingCostPage from "@/pages/ChargingCostPage";
import CarLoanPage from "@/pages/CarLoanPage";
import MonthlyCarCostPage from "@/pages/MonthlyCarCostPage";
import CarAffordabilityPage from "@/pages/CarAffordabilityPage";
import LeaseVsBuyPage from "@/pages/LeaseVsBuyPage";
import NotFoundPage from "@/pages/NotFoundPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <SeoManager />
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<FeaturesPage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogArticlePage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/methodology" element={<MethodologyPage />} />
            <Route path="/editorial-policy" element={<EditorialPolicyPage />} />
            <Route path="/tools" element={<ToolsHubPage />} />
            <Route path="/tools/cost-per-km" element={<CostPerKmPage />} />
            <Route path="/tools/ev-break-even" element={<EvBreakEvenPage />} />
            <Route path="/tools/fuel-cost" element={<FuelCostPage />} />
            <Route path="/tools/depreciation" element={<DepreciationPage />} />
            <Route path="/tools/charging-cost" element={<ChargingCostPage />} />
            <Route path="/tools/car-loan" element={<CarLoanPage />} />
            <Route path="/tools/monthly-car-cost" element={<MonthlyCarCostPage />} />
            <Route path="/tools/car-affordability" element={<CarAffordabilityPage />} />
            <Route path="/tools/lease-vs-buy" element={<LeaseVsBuyPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
        <CookieConsent />
      </div>
    </Router>
  );
}
