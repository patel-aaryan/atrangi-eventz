"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";

export function UserNav() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-20 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">
          Welcome, {session.user.name || session.user.email}
        </span>
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          variant="outline"
          size="sm"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost" size="sm">
        <Link href="/auth/signin">Sign In</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/auth/signup">Sign Up</Link>
      </Button>
    </div>
  );
}
