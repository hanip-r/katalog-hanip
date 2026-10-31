import { getBaseUrl } from "@/lib/base-url";

export default function robots() {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/admin/"] }, sitemap: `${getBaseUrl()}/sitemap.xml` };
}
