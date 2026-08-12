export default function robots() {
  const baseUrl = "https://edulingo.id";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/auth/login", "/auth/register"],
      disallow: ["/dashboard/admin", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
