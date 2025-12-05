/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [new URL('https://lh3.googleusercontent.com/**')],
    },
    reactStrictMode: false,
    pwa: {
        dest: "public",
        register: true,
        skipWaiting: true,
        // Optional: Put OneSignal service worker in a different scope if needed
    },
};

export default nextConfig;
