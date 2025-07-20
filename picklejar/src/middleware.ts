import { NextRequest, NextResponse } from "next/server";

const INDIA_COUNTRY_CODE = "in";

/**
 * Simplified middleware for India-only setup
 */
export async function middleware(request: NextRequest) {
  // check if the url is a static asset
  if (request.nextUrl.pathname.includes(".")) {
    return NextResponse.next();
  }

  const urlHasCountryCode =
    request.nextUrl.pathname.split("/")[1] === INDIA_COUNTRY_CODE;

  // if India country code is in the url, continue
  if (urlHasCountryCode) {
    return NextResponse.next();
  }

  const redirectPath =
    request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname;
  const queryString = request.nextUrl.search ? request.nextUrl.search : "";

  // If no country code is set, redirect to India
  const redirectUrl = `${request.nextUrl.origin}/${INDIA_COUNTRY_CODE}${redirectPath}${queryString}`;
  return NextResponse.redirect(redirectUrl, 307);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
};
