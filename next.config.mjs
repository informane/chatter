/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [new URL('https://lh3.googleusercontent.com/**')],
    },
    reactStrictMode: false,
    /*pwa: {
        dest: "public",
        register: true,
        skipWaiting: true,
    },*/
};

export default nextConfig;
