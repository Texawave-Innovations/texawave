/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "images.pexels.com"
      }
    ]
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default async () => {
  if (process.env.ANALYZE === "true") {
    try {
      const withBundleAnalyzer = (await import("@next/bundle-analyzer")).default;
      return withBundleAnalyzer({
        enabled: true,
      })(nextConfig);
    } catch (error) {
      console.warn("Could not load @next/bundle-analyzer. Proceeding without bundle analysis.", error);
    }
  }
  return nextConfig;
};

