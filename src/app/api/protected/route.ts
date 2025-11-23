// Example of a protected API route

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized - Please sign in" },
      { status: 401 }
    );
  }

  // Your protected API logic here
  return NextResponse.json({
    message: "This is protected data",
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    },
  });
}
