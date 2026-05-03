const imageHosts = (process.env.NEXT_PUBLIC_IMAGE_HOSTS || "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean)

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
      ...imageHosts.flatMap((hostname) => [
        {
          protocol: "https",
          hostname,
        },
        {
          protocol: "http",
          hostname,
        },
      ]),
    ],
  },
}

export default nextConfig
