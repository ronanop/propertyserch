import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AR Buildwel",
    short_name: "Buildwel",
    description: "Real Estate Transaction Operating System",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0f766e",
    icons: [
      { src: "/icon.svg", sizes: "512x512", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "512x512", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
