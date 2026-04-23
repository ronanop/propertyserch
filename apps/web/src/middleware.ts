import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED = ["en", "hi"] as const;

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  const accept = request.headers.get("accept-language") ?? "";
  const fromHeader = accept.split(",")[0]?.trim().slice(0, 2).toLowerCase();
  const locale =
    cookie && SUPPORTED.includes(cookie as (typeof SUPPORTED)[number])
      ? cookie
      : fromHeader === "hi"
        ? "hi"
        : "en";

  const res = NextResponse.next();
  res.headers.set("x-locale", locale);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
