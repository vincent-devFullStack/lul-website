/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.iconodule.fr",
  generateRobotsTxt: true,
  exclude: ["/admin/*", "/login", "/register"],
  generateIndexSitemap: true,
  outDir: "public",
};
