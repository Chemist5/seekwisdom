import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import idMap from "@/content/id-map.json";

const ids = idMap as Record<string, string>;

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const legacyId = searchParams.get("p") || searchParams.get("page_id");
  const onFront = pathname === "/" || pathname === "/index.php" || pathname === "/index.php/";
  if (legacyId && onFront && ids[legacyId]) {
    const url = request.nextUrl.clone();
    url.pathname = `/${ids[legacyId]}/`;
    url.search = "";
    return NextResponse.redirect(url, 308);
  }

  if ((pathname === "/" || pathname === "") && searchParams.has("s")) {
    const url = request.nextUrl.clone();
    url.pathname = "/search/";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/index.php"],
};
