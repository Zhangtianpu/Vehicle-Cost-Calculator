import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function NotFoundPage() {
  const { locale } = useLanguageStore();
  const isZh = locale === "zh";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <Compass className="mx-auto h-12 w-12 text-emerald-500" />
      <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-emerald-600">404</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-800">{isZh ? "页面不存在" : "Page not found"}</h1>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
        {isZh ? "这个地址可能已更改或输入有误。您可以返回首页，或使用免费的用车成本工具。" : "The address may have changed or been entered incorrectly. Return home or use one of the free vehicle cost tools."}
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link to="/" className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700">
          {isZh ? "返回首页" : "Back to home"}
        </Link>
        <Link to="/tools" className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          {isZh ? "浏览免费工具" : "Browse free tools"}
        </Link>
      </div>
    </div>
  );
}
