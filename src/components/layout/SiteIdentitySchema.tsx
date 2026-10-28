import { useLocation } from "react-router-dom";

export default function SiteIdentitySchema() {
  const { pathname } = useLocation();
  const normalizedPath = pathname !== "/" ? pathname.replace(/\/$/, "") : "/";

  if (normalizedPath !== "/") return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Vehicle Cost Calculator",
    alternateName: "sidehustle.top",
    url: "https://sidehustle.top/",
  };

  return (
    <script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
