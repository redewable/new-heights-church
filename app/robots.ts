import type { MetadataRoute } from "next";
import { CHURCH } from "@/lib/constants/church";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/member", "/checkin"],
      },
    ],
    sitemap: `${CHURCH.urls.site}/sitemap.xml`,
    host: CHURCH.urls.site,
  };
}
