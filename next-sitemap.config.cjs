/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.iconodule.fr",
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  outDir: "public",
  exclude: ["/admin", "/admin/*", "/login", "/register", "/forgot-password"],
};
