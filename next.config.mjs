/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  async redirects() {
    return [
      { source: "/page/1", destination: "/", permanent: true },
      { source: "/comments/feed", destination: "/feed/", permanent: true },
      { source: "/author/seek-wisdom/page/1", destination: "/author/seek-wisdom/", permanent: true },
    ];
  },
};

export default nextConfig;
