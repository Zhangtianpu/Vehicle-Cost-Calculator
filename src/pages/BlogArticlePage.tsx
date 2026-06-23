import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function BlogArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguageStore();

  const articles = [
    {
      id: 1,
      title: t.blog.article1Title,
      summary: t.blog.article1Summary,
      content: t.blog.article1Content,
      date: "2024-01-15",
      readTime: "5 min",
      category: t.blog.categoryEV,
    },
    {
      id: 2,
      title: t.blog.article2Title,
      summary: t.blog.article2Summary,
      content: t.blog.article2Content,
      date: "2024-01-10",
      readTime: "8 min",
      category: t.blog.categoryCost,
    },
    {
      id: 3,
      title: t.blog.article3Title,
      summary: t.blog.article3Summary,
      content: t.blog.article3Content,
      date: "2024-01-05",
      readTime: "6 min",
      category: t.blog.categoryTips,
    },
    {
      id: 4,
      title: t.blog.article4Title,
      summary: t.blog.article4Summary,
      content: t.blog.article4Content,
      date: "2024-01-01",
      readTime: "7 min",
      category: t.blog.categoryInsurance,
    },
  ];

  const article = articles.find((a) => a.id === Number(id));

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-slate-500">{t.blog.notFound}</p>
          <Link
            to="/blog"
            className="mt-4 inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.blog.backToList}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {t.blog.backToList}
      </Link>

      <article className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
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

        <h1 className="text-2xl font-bold text-slate-800 mb-4">
          {article.title}
        </h1>

        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          {article.summary}
        </p>

        <div className="prose prose-slate max-w-none">
          <div className="text-slate-700 leading-relaxed space-y-4">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>

      <div className="mt-8 bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">{t.blog.aboutTitle}</h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          {t.blog.aboutContent}
        </p>
      </div>
    </div>
  );
}