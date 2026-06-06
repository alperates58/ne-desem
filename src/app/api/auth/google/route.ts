import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/google/callback`;

  if (!clientId) {
    return NextResponse.json({ message: "Google Client ID is not configured." }, { status: 500 });
  }

  // Construct Google Auth URL with scopes openid, email, profile
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=openid%20email%20profile`;

  return NextResponse.redirect(googleAuthUrl);
}
