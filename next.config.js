/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'export',
    // Rewrites are not supported in static export
    // async rewrites() {
    //     return [
    //         {
    //             source: '/api/:path*',
    //             destination: 'http://192.168.1.104:8080/api/:path*',
    //         },
    //         {
    //             source: '/files/:path*',
    //             destination: 'http://192.168.1.104:8080/files/:path*',
    //         },
    //     ];
    // },
};

module.exports = nextConfig;
