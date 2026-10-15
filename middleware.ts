import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // Extract clean host without port (e.g. pardeep-kumar.lovedrop.online or lovedrop.online)
  const cleanHost = hostname.split(":")[0].toLowerCase();

  let subdomain: string | null = null;
  if (cleanHost.endsWith(".lovedrop.online")) {
    subdomain = cleanHost.replace(".lovedrop.online", "").trim();
  } else if (cleanHost.endsWith(".localhost")) {
    subdomain = cleanHost.replace(".localhost", "").trim();
  }

  // If a valid custom subdomain is detected (not www, api, etc.)
  if (subdomain && subdomain !== "www" && subdomain !== "api") {
    // Ignore static files and api routes
    if (
      url.pathname.startsWith("/_next") ||
      url.pathname.startsWith("/api") ||
      url.pathname.startsWith("/images") ||
      url.pathname.startsWith("/stickers") ||
      url.pathname.startsWith("/music") ||
      url.pathname.startsWith("/favicon.ico") ||
      url.pathname.startsWith("/icon") ||
      url.pathname.startsWith("/logo") ||
      url.pathname.startsWith("/apple-")
    ) {
      return NextResponse.next();
    }

    // Rewrite root URL on subdomain to /p/[subdomain]
    // e.g. https://pardeep-kumar.lovedrop.online/ -> renders /p/pardeep-kumar
    if (url.pathname === "/" || url.pathname === "") {
      return NextResponse.rewrite(new URL(`/p/${subdomain}`, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.*\\.png|logo.*\\.png|apple-.*\\.png).*)",
  ],
};
