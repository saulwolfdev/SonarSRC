import {NextFederationPlugin} from "@module-federation/nextjs-mf"
  
const nextConfig = {
    reactStrictMode: true, 
    output: 'export',
   // transpilePackages: ["transformacion-src-mf-shared","transformacion-src-mf-maestros"],
    webpack(config, options) {
       config.plugins.push(
         new NextFederationPlugin({
           name: "shell",
           filename: "static/chunks/remoteEntry.js", 
           extraOptions: {
             exposePages: true,
             automaticAsyncBoundary: true,
           },
         })
      );
      return config;
    },
    async rewrites() {
    return [
        {
            source: '/.auth/:path*', 
            destination: 'http://localhost:3000/.auth/:path*',
        },
        {
            source: '/api/:path*',
            destination: 'http://localhost:3000/api/:path*',
        },
        {
            source: '/health',
            destination: 'http://localhost:3000/health',
        } 
    ]
  },
};

export default nextConfig;
