import { renderShareImage } from "@/lib/ogoh/share-image";

export const alt = "OGOH — Suv toʻsiq ogohlantirish tizimi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderShareImage();
}
