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

// Paths that are always public (gate page itself + its assets)
const ALWAYS_ALLOW = [
  '/access-required.html',
  '/EN.png',
  '/EN-fav-black.png',
  '/EN-Blue.png',
  '/enow_logo.svg',
  '/Elevatenow-Logo.svg',
  '/elevatenowlogo.png',
  '/favicon.ico',
  '/favicon.svg',
  '/robots.txt',
];

function getCookieToken(cookieHeader) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Always serve the gate page and essential assets
  if (ALWAYS_ALLOW.includes(pathname) || pathname.startsWith('/assets/')) {
    return next();
  }

  // Check for token in URL query param
  const queryToken = url.searchParams.get('token');
  if (queryToken !== null) {
    if (queryToken === VALID_TOKEN) {
      // Valid → set cookie, redirect clean (strip the token param from URL)
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
      // Wrong token → back to gate with error flag
      return new Response(null, {
        status: 302,
        headers: { 'Location': `${url.origin}/access-required.html?err=1` },
      });
    }
  }

  // Check for valid cookie
  const cookieToken = getCookieToken(request.headers.get('Cookie'));
  if (cookieToken === VALID_TOKEN) {
    return next();
  }

  // No valid token → send to gate page
  return new Response(null, {
    status: 302,
    headers: { 'Location': `${url.origin}/access-required.html` },
  });
}
