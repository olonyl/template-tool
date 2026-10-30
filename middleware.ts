import { NextResponse, type NextRequest } from "next/server";

/**
 * Simple HTTP Basic Auth gate. Credentials live only in Vercel env vars
 * (AUTH_USER / AUTH_PASSWORD) — never in this repo.
 */
export function middleware(request: NextRequest) {
  const user = process.env.AUTH_USER;
  const pass = process.env.AUTH_PASSWORD;

  // If no credentials are configured (e.g. local dev without .env.local), skip the gate.
  if (!user || !pass) return NextResponse.next();

  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme === "Basic" && encoded) {
      const [providedUser, providedPass] = atob(encoded).split(":");
      if (providedUser === user && providedPass === pass) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse("Autenticación requerida", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Generador de promociones"' },
  });
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
