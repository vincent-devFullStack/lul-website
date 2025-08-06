/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false, // Supprime le header X-Powered-By
  compress: true, // Compression Gzip
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
