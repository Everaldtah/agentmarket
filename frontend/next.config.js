/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.dicebear.com', 'avatars.githubusercontent.com', 'picsum.photos'],
  },
}

module.exports = nextConfig
