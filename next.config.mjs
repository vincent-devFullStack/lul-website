/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ],
  },

  async headers() {
    return [
      // index du sitemap
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0, must-revalidate",
          },
        ],
      },
      // shards générés (sitemap-0.xml, sitemap-1.xml, …)
      {
        source: "/sitemap-:index.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0, must-revalidate",
          },
        ],
      },
      // robots.txt
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },

  // Optionnel : force https://www.iconodule.fr/ en 308
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "iconodule.fr" }],
        destination: "https://www.iconodule.fr/:path*",
        permanent: true, // 308
      },
    ];
  },
};

export default nextConfig;
