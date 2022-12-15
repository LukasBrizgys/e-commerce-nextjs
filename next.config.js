/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images:{
    remotePatterns:[
      {
        protocol:'https',
        hostname:'njkmajcfosaflafhlphb.supabase.co',
        pathname:'/storage/v1/object/public/pictures/**'
      }
    ],
  }
}

module.exports = nextConfig
