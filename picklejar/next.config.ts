import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  swcMinify: true,
  compress: true,

  // Image optimization
  images: {
    domains: ["res.cloudinary.com"],
    formats: ["image/webp", "image/avif"],
  },

  // Bundle analyzer (uncomment for debugging)
  // experimental: {
  //   bundlePagesExternally: true,
  // },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig;
