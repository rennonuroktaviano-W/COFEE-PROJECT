/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    /**
     * The project's artwork is authored as local SVG. `dangerouslyAllowSVG` is
     * enabled together with a locked-down content security policy so those files
     * cannot execute script. The placeholder SVGs in /public/placeholders can be
     * swapped for real photography later — next/image optimises those
     * automatically, so no further config change is needed.
     */
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
