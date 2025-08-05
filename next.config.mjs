/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    domains: ['c.animaapp.com'],
    unoptimized: true,
  },
  transpilePackages: ['@ionic/react', '@ionic/core'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    // Handle dynamic imports for Stencil
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false
      }
    })
    
    return config
  }
}

export default nextConfig
