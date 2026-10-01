import type { MetadataRoute } from "next";
import { site } from "@/content/site";

const paths = ["/", "/contact", "/pilot", "/pilot-students", "/pilot-employers", "/contact-1"];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({ url: site.url + (path === "/" ? "" : path), changeFrequency: "monthly" }));
}
