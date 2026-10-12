import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lovedrop.online";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/create", "/demo", "/apology"],
        disallow: ["/api/", "/p/"], // Keep private surprise pages and internal APIs unindexed
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
