/**
 * Resolves an Unsplash page URL to a direct CDN image URL.
 * If the URL is an Unsplash detail page, it extracts the photo ID,
 * sends a HEAD request to the download endpoint, and retrieves the direct CDN location.
 */
export async function resolveUnsplashUrl(url: string): Promise<string> {
  if (!url) return url;
  const trimmed = url.trim();

  try {
    const urlObj = new URL(trimmed);

    if (urlObj.hostname.includes("unsplash.com")) {
      const parts = urlObj.pathname.split("/").filter(Boolean);
      if (parts[0] === "photos" && parts[1]) {
        const photoPart = parts[1];
        // Extract the photo ID (the last segment of the part after dashes, or the whole part)
        const lastHyphenIndex = photoPart.lastIndexOf("-");
        const photoId = lastHyphenIndex !== -1 ? photoPart.substring(lastHyphenIndex + 1) : photoPart;

        // Construct the download redirect URL
        const redirectUrl = `https://unsplash.com/photos/${photoId}/download?force=true`;

        // Send a HEAD request on the server to follow the redirect
        const res = await fetch(redirectUrl, {
          method: "HEAD",
          redirect: "manual",
        });

        if (res.status === 302 || res.status === 301) {
          const directUrl = res.headers.get("location");
          if (directUrl) {
            return directUrl;
          }
        }

        // Fallback: return the redirectUrl so the browser can handle it
        return redirectUrl;
      }
    }
  } catch (error) {
    console.error("Error resolving Unsplash URL:", error);
  }

  return trimmed;
}

/**
 * Resolves all image URLs in an array.
 */
export async function resolveImageUrls(urls: string[]): Promise<string[]> {
  if (!urls || urls.length === 0) return urls;
  return Promise.all(urls.map((url) => resolveUnsplashUrl(url)));
}
