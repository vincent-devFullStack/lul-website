// next.config.mjs
const isTurbopack = process.env.TURBOPACK === "1";

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
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lucide-react", "react-icons"],
  },

  ...(isTurbopack
    ? {}
    : {
        webpack(config) {
          config.optimization.usedExports = true;
          return config;
        },
      }),
};

export default nextConfig;
