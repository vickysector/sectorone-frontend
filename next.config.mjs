/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "icon.horse",
      },
    ],
  },
};

export default nextConfig;
