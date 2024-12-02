/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "randomuser.me"
            },
            {
                protocol: "https",
                hostname: "firebasestorage.googleapis.com"
            },
            {
                protocol: "https",
                hostname: "img.clerk.com"
            }
        ]
    },
};

export default nextConfig;