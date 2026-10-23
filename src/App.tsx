import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/layout/CookieConsent";
import SeoManager from "@/components/layout/SeoManager";

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
const ToolsHubPage = lazy(() => import("@/pages/ToolsHubPage"));
const CostPerKmPage = lazy(() => import("@/pages/CostPerKmPage"));
const EvBreakEvenPage = lazy(() => import("@/pages/EvBreakEvenPage"));

function PageLoader() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center" role="status" aria-label="Loading">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <SeoManager />
        <Header />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<FeaturesPage />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogArticlePage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/methodology" element={<MethodologyPage />} />
              <Route path="/tools" element={<ToolsHubPage />} />
              <Route path="/tools/cost-per-km" element={<CostPerKmPage />} />
              <Route path="/tools/ev-break-even" element={<EvBreakEvenPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <CookieConsent />
      </div>
    </Router>
  );
}
