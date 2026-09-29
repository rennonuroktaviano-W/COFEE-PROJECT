/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    /**
     * The project's artwork is authored as local SVG. `dangerouslyAllowSVG` is
     * enabled together with a locked-down content security policy so those files
     * cannot execute script or load external resources, while still rendering
     * inline.
     *
     * `contentDispositionType: "attachment"` is deliberately NOT used: it makes
     * browsers download the SVG instead of rendering it, which breaks every
     * placeholder image on the page. The CSP below is the safe alternative.
     *
     * The placeholder SVGs in /public/placeholders can be swapped for real
     * photography later — next/image optimises those automatically, so no
     * further config change is needed.
     */
    dangerouslyAllowSVG: true,
    /**
     * Next.js defaults this to "attachment", which makes browsers download the
     * SVG instead of painting it — every placeholder image on the page would
     * fail to load. "inline" plus the sandboxed CSP above keeps the files from
     * executing anything while still rendering.
     */
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
