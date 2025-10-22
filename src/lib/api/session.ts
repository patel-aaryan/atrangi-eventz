// Utility functions for session management

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth";

/**
 * Get the current session on the server side
 * Use this in server components and API routes
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

/**
 * Check if user is authenticated
 * Use this in server components and API routes
 */
export async function isAuthenticated() {
  const session = await getServerSession(authOptions);
  return !!session?.user;
}

/**
 * Require authentication - redirects to sign in if not authenticated
 * Use this in server components that require authentication
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session?.user) return null;

  return session.user;
}
