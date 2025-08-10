const lastmod = new Date().toISOString().split(".")[0] + "Z";

/** @type {import('next-sitemap').IConfig} */
export default {
  siteUrl: "https://www.iconodule.fr",
  outDir: "public",
  generateRobotsTxt: true,
  autoLastmod: false,

  transform: async (config, path) => {
    if (path === "/" || path === "/accueil") {
      return {
        loc: path,
        changefreq: path === "/" ? "daily" : "weekly",
        priority: path === "/" ? 0.8 : 0.7,
        lastmod,
      };
    }
    return null;
  },

  additionalPaths: async () => [],
  exclude: ["/admin/*", "/api/*"],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        disallow: [
          "/admin/",
          "/api/",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
        ],
      },
    ],
  },
};
