const lastmod = new Date().toISOString();

const config = {
  siteUrl: "https://www.iconodule.fr",
  outDir: "public",
  generateRobotsTxt: true,

  // N’inclure que "/" et "/accueil" dans le sitemap
  transform: async (config, path) => {
    if (path === "/" || path === "/accueil") {
      return {
        loc: path,
        changefreq: path === "/" ? "daily" : "weekly",
        priority: path === "/" ? 0.8 : 0.7,
        lastmod,
      };
    }
    return null; // exclut toutes les autres routes
  },

  // Au cas où Next ne détecte pas “/accueil”, on l’ajoute explicitement
  additionalPaths: async () => [
    { loc: "/", changefreq: "daily", priority: 0.8, lastmod },
    { loc: "/accueil", changefreq: "weekly", priority: 0.7, lastmod },
  ],

  // Par sécurité, on exclut les sections non désirées
  exclude: [
    "/admin/*",
    "/api/*",
    "/rooms/*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/about",
    "/contact",
    "/memento",
    "/credits-artistiques",
    "/mentions-legales",
    "/politique-confidentialite",
  ],

  // Robots.txt: tout bloquer sauf “/” et “/accueil”
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        disallow: ["/"],
        allow: ["/$", "/accueil$"],
      },
    ],
  },
};

module.exports = config;
