import { type NextRequest, NextResponse } from "next/server"

// Production URL constant - used when NODE_ENV is production
const PRODUCTION_URL = "https://www.ocr-extraction.com";

export async function GET(request: NextRequest) {
  // Use build-time injected env vars (via next.config.mjs)
  const isDev = process.env.NODE_ENV !== "production";
  const baseUrl = isDev ? "http://localhost:3000" : PRODUCTION_URL;
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.error("[Auth] Missing GOOGLE_CLIENT_ID - check next.config.mjs env injection");
    return NextResponse.redirect(new URL("/?error=config_error", baseUrl));
  }

  const redirectUri = `${baseUrl}/api/auth/callback/google`;

  console.log(`[Auth] OAuth initiation`);
  console.log(`[Auth] Client ID: ${clientId.substring(0, 15)}...`);
  console.log(`[Auth] Redirect URI: ${redirectUri}`);
  console.log(`[Auth] NODE_ENV: ${process.env.NODE_ENV}`);

  // Build Google OAuth URL
  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.append("client_id", clientId);
  googleAuthUrl.searchParams.append("redirect_uri", redirectUri);
  googleAuthUrl.searchParams.append("response_type", "code");
  googleAuthUrl.searchParams.append("scope", "openid profile email");
  googleAuthUrl.searchParams.append("access_type", "offline");

  return NextResponse.redirect(googleAuthUrl.toString());
}
