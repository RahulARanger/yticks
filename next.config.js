const constants = require("next/constants");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["echarts", "zrender"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "yt3.ggpht.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = (phase, { defaultConfig }) => {
  let extras = {};

  if (process.env.ANALYZE && phase === constants.PHASE_DEVELOPMENT_SERVER) {
    const withNextBundleAnalyzer = require("next-bundle-analyzer")({
      clientOnly: false,
    });
    extras = withNextBundleAnalyzer(nextConfig);
  }

  return { ...defaultConfig, ...extras, ...nextConfig };
};
