import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function BlogPage() {
  const { t, locale } = useLanguageStore();

  const articles = [
    {
      id: 1,
      title: t.blog.article1Title,
      summary: t.blog.article1Summary,
      date: "2024-01-15",
      readTime: "5 min",
      category: t.blog.categoryEV,
    },
    {
      id: 2,
      title: t.blog.article2Title,
      summary: t.blog.article2Summary,
      date: "2024-01-10",
      readTime: "8 min",
      category: t.blog.categoryCost,
    },
    {
      id: 3,
      title: t.blog.article3Title,
      summary: t.blog.article3Summary,
      date: "2024-01-05",
      readTime: "6 min",
      category: t.blog.categoryTips,
    },
    {
      id: 4,
      title: t.blog.article4Title,
      summary: t.blog.article4Summary,
      date: "2024-01-01",
      readTime: "7 min",
      category: t.blog.categoryInsurance,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">{t.blog.title}</h1>
        <p className="text-slate-500">{t.blog.subtitle}</p>
      </div>

      <div className="space-y-6">
        {articles.map((article) => (
          <article
            key={article.id}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                {article.category}
              </span>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readTime}</span>
              </div>
            </div>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">
              {article.title}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              {article.summary}
            </p>
            <Link
              to={`/blog/${article.id}`}
              className="inline-flex items-center gap-1 text-emerald-600 text-sm font-medium hover:text-emerald-700"
            >
              {t.blog.readMore}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-8 bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">{t.blog.aboutTitle}</h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          {t.blog.aboutContent}
        </p>
      </div>
    </div>
  );
}