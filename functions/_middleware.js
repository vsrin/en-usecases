// ─────────────────────────────────────────────────────────────────────────────
// ElevateNow Insights — Access Gate
// Cloudflare Pages Functions middleware: runs at the edge before every request.
//
// ACCESS TOKEN — change this to whatever token you want to share with contacts:
const VALID_TOKEN = 'ENinsights26';
//
// COOKIE — how long the token stays valid (seconds). Default: 7 days.
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;
// ─────────────────────────────────────────────────────────────────────────────

const COOKIE_NAME = 'en_access_token';

function getCookieToken(cookieHeader) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function isAsset(pathname) {
  // Allow static assets the gate page itself needs — never gate these
  if (pathname.startsWith('/assets/')) return true;
  const staticFiles = ['/EN.png', '/EN-Blue.png', '/EN-fav-black.png',
    '/enow_logo.svg', '/Elevatenow-Logo.svg', '/elevatenowlogo.png',
    '/favicon.ico', '/favicon.svg', '/robots.txt'];
  return staticFiles.includes(pathname);
}

export async function onRequest({ request, next, env }) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Always pass through static assets
  if (isAsset(pathname)) return next();

  // Token in URL → validate and either set cookie or show error
  const queryToken = url.searchParams.get('token');
  if (queryToken !== null) {
    if (queryToken === VALID_TOKEN) {
      // Valid → set cookie, strip token from URL, redirect clean
      const cleanUrl = new URL(url);
      cleanUrl.searchParams.delete('token');
      return new Response(null, {
        status: 302,
        headers: {
          'Location': cleanUrl.toString(),
          'Set-Cookie': `${COOKIE_NAME}=${encodeURIComponent(VALID_TOKEN)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax; Secure`,
        },
      });
    } else {
      // Wrong token → serve gate page with error flag (no redirect)
      return env.ASSETS.fetch(
        new Request(`${url.origin}/access-required.html?err=1`, { headers: request.headers })
      );
    }
  }

  // Valid cookie → allow through
  const cookieToken = getCookieToken(request.headers.get('Cookie'));
  if (cookieToken === VALID_TOKEN) return next();

  // No valid token → serve gate page directly (avoids redirect loops from CF pretty-URL rewriting)
  return env.ASSETS.fetch(
    new Request(`${url.origin}/access-required.html`, { headers: request.headers })
  );
}
