export const SITE_URL = "https://sidehustle.top";

const website = { "@type": "WebSite", name: "Vehicle Cost Calculator", url: `${SITE_URL}/` };

function normalizePath(path) {
  return path === "/" ? path : path.replace(/\/$/, "");
}

function canonicalUrl(path) {
  const normalizedPath = normalizePath(path);
  const canonicalPath = normalizedPath === "/" || normalizedPath.endsWith(".html") ? normalizedPath : `${normalizedPath}/`;
  return `${SITE_URL}${canonicalPath}`;
}

export function getRouteSchemaType(path) {
  const normalizedPath = normalizePath(path);

  if (/^\/blog\/\d+$/.test(normalizedPath)) return "Article";
  if (normalizedPath === "/tools" || normalizedPath === "/blog") return "CollectionPage";
  if (normalizedPath === "/" || normalizedPath === "/calculator" || normalizedPath === "/compare" || normalizedPath.startsWith("/tools/")) return "WebApplication";
  if (normalizedPath === "/about") return "AboutPage";
  if (normalizedPath === "/contact") return "ContactPage";
  return "WebPage";
}

export function createRouteSchema({ path, title, description, articleName = title, collectionPaths = [] }) {
  const type = getRouteSchemaType(path);
  const canonical = canonicalUrl(path);
  const schema = {
    "@context": "https://schema.org",
    "@type": type,
    name: type === "Article" ? articleName : title,
    description,
    url: canonical,
    isAccessibleForFree: true,
  };

  if (type === "Article") {
    return {
      ...schema,
      headline: articleName,
      image: `${SITE_URL}/vehicle-cost-social-card.png`,
      datePublished: "2026-06-23T15:29:03+08:00",
      dateModified: "2026-10-28T18:02:36+08:00",
      author: { "@type": "Person", name: "Zhangtianpu", url: "https://github.com/Zhangtianpu" },
      publisher: { "@type": "Organization", name: "Vehicle Cost Calculator", url: `${SITE_URL}/` },
      mainEntityOfPage: canonical,
    };
  }

  if (type === "WebApplication") {
    return {
      ...schema,
      name: title.split("｜")[0].split("|")[0].trim(),
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: 0 },
    };
  }

  if (type === "CollectionPage") {
    return {
      ...schema,
      isPartOf: website,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: collectionPaths.length,
        itemListElement: collectionPaths.map((itemPath, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: canonicalUrl(itemPath),
        })),
      },
    };
  }

  return { ...schema, isPartOf: website };
}
