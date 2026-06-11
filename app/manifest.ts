import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OGOH — Suv toʻsiq ogohlantirish tizimi",
    short_name: "OGOH",
    description:
      "Operator uchun favqulodda ogohlantirish tizimi — aholini SMS va ovozli qoʻngʻiroq orqali xabardor qilish.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0C0D10",
    theme_color: "#0C0D10",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
