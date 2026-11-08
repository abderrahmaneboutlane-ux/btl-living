/** @type {import('next').NextConfig} */
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig = {
  // R3F + dynamic(ssr:false): StrictMode's dev double-mount can leave the WebGL
  // root un-reinitialised. Off in dev is the standard R3F setup.
  reactStrictMode: false,
  transpilePackages: ["three"],
  images: {
    // product images now live in Supabase Storage (bucket "media")
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;