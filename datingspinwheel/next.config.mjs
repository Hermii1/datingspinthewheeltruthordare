/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Updated configuration for external packages (replaces experimental.serverComponentsExternalPackages)
  serverExternalPackages: ["@prisma/client"],
  
  // Optional configurations
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

export default nextConfig