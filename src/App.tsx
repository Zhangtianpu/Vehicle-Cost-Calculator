import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/layout/CookieConsent";
import SeoManager from "@/components/layout/SeoManager";
import RouteLoading from "@/components/layout/RouteLoading";

const CalculatorPage = lazy(() => import("@/pages/CalculatorPage"));
const ComparePage = lazy(() => import("@/pages/ComparePage"));
const FeaturesPage = lazy(() => import("@/pages/FeaturesPage"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const BlogArticlePage = lazy(() => import("@/pages/BlogArticlePage"));
const FAQPage = lazy(() => import("@/pages/FAQPage"));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const DisclaimerPage = lazy(() => import("@/pages/DisclaimerPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const MethodologyPage = lazy(() => import("@/pages/MethodologyPage"));
const EditorialPolicyPage = lazy(() => import("@/pages/EditorialPolicyPage"));
const ToolsHubPage = lazy(() => import("@/pages/ToolsHubPage"));
const CostPerKmPage = lazy(() => import("@/pages/CostPerKmPage"));
const EvBreakEvenPage = lazy(() => import("@/pages/EvBreakEvenPage"));
const FuelCostPage = lazy(() => import("@/pages/FuelCostPage"));
const DepreciationPage = lazy(() => import("@/pages/DepreciationPage"));
const ChargingCostPage = lazy(() => import("@/pages/ChargingCostPage"));
const CarLoanPage = lazy(() => import("@/pages/CarLoanPage"));
const MonthlyCarCostPage = lazy(() => import("@/pages/MonthlyCarCostPage"));
const CarAffordabilityPage = lazy(() => import("@/pages/CarAffordabilityPage"));
const LeaseVsBuyPage = lazy(() => import("@/pages/LeaseVsBuyPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <SeoManager />
        <Header />
        <main className="flex-1">
          <Suspense fallback={<RouteLoading />}>
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
          </Suspense>
        </main>
        <Footer />
        <CookieConsent />
      </div>
    </Router>
  );
}
