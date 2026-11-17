import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  // The Tailwind loader rule that create-next-app added is removed: the site does not use Tailwind,
  // and the rule renamed every .module.css file to plain CSS, which broke CSS Modules.
};

export default nextConfig;
