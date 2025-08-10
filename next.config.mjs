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
  // Ajouter ces optimisations
  experimental: {
    optimizeBrowserPerformance: true,
    optimizeCss: true,
    optimizePackageImports: ["lucide-react", "react-icons"],
  },
  // Améliorer le tree-shaking
  webpack: (config) => {
    config.optimization.usedExports = true;
    return config;
  },
};

export default nextConfig;
