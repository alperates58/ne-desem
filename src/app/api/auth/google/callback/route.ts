import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { attachSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(new URL("/login?error=Google authentication failed.", baseUrl));
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(new URL("/login?error=Google credentials not configured.", baseUrl));
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      console.error("Google Token exchange failed:", tokenData);
      return NextResponse.redirect(new URL("/login?error=Failed to exchange code.", baseUrl));
    }

    const { access_token } = tokenData;

    // Fetch user info from Google APIs
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const userInfo = await userInfoResponse.json();
    if (!userInfoResponse.ok) {
      console.error("Failed to fetch user info from Google:", userInfo);
      return NextResponse.redirect(new URL("/login?error=Failed to retrieve user info.", baseUrl));
    }

    const email = userInfo.email.toLocaleLowerCase("tr-TR");
    const name = userInfo.name || userInfo.given_name || "Google Kullanıcısı";

    // Find or create user in database
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Find or create default Free tier
      let freeTier = await prisma.membershipTier.findFirst({
        where: { name: { equals: "Free", mode: "insensitive" } },
      });

      if (!freeTier) {
        freeTier = await prisma.membershipTier.create({
          data: {
            name: "Free",
            price: 0,
            monthlyLimit: 5,
          },
        });
      }

      // Generate random secure password hash
      const crypto = await import("crypto");
      const randomPassword = crypto.randomBytes(32).toString("hex");
      const { hash } = await import("bcryptjs");
      const passwordHash = await hash(randomPassword, 12);

      user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          membershipTierId: freeTier.id,
        },
      });
    }

    // Attach custom session cookie and redirect to dashboard
    const response = NextResponse.redirect(new URL("/dashboard", baseUrl));
    return await attachSession(response, user.id);
  } catch (error) {
    console.error("Google Auth Callback Error:", error);
    return NextResponse.redirect(new URL("/login?error=Internal server error during authentication.", baseUrl));
  }
}
