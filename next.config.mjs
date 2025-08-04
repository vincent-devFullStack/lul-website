/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "www.iconodule.fr",
          },
        ],
        destination: "https://iconodule.fr/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
