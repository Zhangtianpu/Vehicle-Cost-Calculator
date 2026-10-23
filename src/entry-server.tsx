import { renderToString } from "react-dom/server";
import { Route, Routes, StaticRouter } from "react-router";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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
import ToolsHubPage from "@/pages/ToolsHubPage";
import CostPerKmPage from "@/pages/CostPerKmPage";
import EvBreakEvenPage from "@/pages/EvBreakEvenPage";
import NotFoundPage from "@/pages/NotFoundPage";

export function render(pathname: string) {
  return renderToString(
    <StaticRouter location={pathname}>
      <div className="min-h-screen flex flex-col bg-slate-50">
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
            <Route path="/tools" element={<ToolsHubPage />} />
            <Route path="/tools/cost-per-km" element={<CostPerKmPage />} />
            <Route path="/tools/ev-break-even" element={<EvBreakEvenPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </StaticRouter>,
  );
}
