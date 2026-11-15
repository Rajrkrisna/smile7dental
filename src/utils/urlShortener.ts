/**
 * URL Shortener helper for Smile7 Dental Clinic.
 * Compresses long data tokens (~1300 chars) into ultra-short links (~25 chars like https://tinyurl.com/...)
 * so patients receive a clean, friendly 1-click download link in WhatsApp.
 */

const shortUrlCache = new Map<string, string>();

export async function shortenUrl(longUrl: string): Promise<string> {
  if (!longUrl || longUrl.length < 50) return longUrl;

  if (shortUrlCache.has(longUrl)) {
    return shortUrlCache.get(longUrl)!;
  }

  // 1. Try local desktop backend bridge (running in Smile7Dental.exe - zero CORS, fast)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const resp = await fetch(`/api/shorten?url=${encodeURIComponent(longUrl)}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (resp.ok) {
      const data = await resp.json();
      if (data && data.success && typeof data.shortUrl === 'string' && data.shortUrl.startsWith('http')) {
        shortUrlCache.set(longUrl, data.shortUrl);
        return data.shortUrl;
      }
    }
  } catch {
    // Fallback to direct client-side fetch
  }

  // 2. Try TinyURL directly (supports CORS & https)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const resp = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (resp.ok) {
      const text = (await resp.text()).trim();
      if (text.startsWith('http://') || text.startsWith('https://')) {
        shortUrlCache.set(longUrl, text);
        return text;
      }
    }
  } catch {
    // Fallback to next provider
  }

  // 3. Try is.gd directly
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const resp = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(longUrl)}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (resp.ok) {
      const text = (await resp.text()).trim();
      if (text.startsWith('http://') || text.startsWith('https://')) {
        shortUrlCache.set(longUrl, text);
        return text;
      }
    }
  } catch {
    // Fallback to original longUrl
  }

  // If offline or network unreachable, safely fallback to the full valid direct URL
  return longUrl;
}

