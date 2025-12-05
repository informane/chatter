/** @type {import('next').NextConfig} */
/*import withPWA from "next-pwa";

module.exports = withPWA({
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    // Optional: Put OneSignal service worker in a different scope if needed
  },
  // your other Next.js configs
});*/

const nextConfig = {
    images: {
        remotePatterns: [new URL('https://lh3.googleusercontent.com/**')],
    },
    reactStrictMode: false,
};
export default nextConfig;
