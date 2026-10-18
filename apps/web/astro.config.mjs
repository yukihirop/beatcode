// @ts-check
import { defineConfig } from "astro/config";

// Where the site is served: the links in og:url and og:image start with it. Pass SITE_URL when it moves (a domain)
export default defineConfig({
  site: process.env.SITE_URL || "https://beatcode.run",
});
