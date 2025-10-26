import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import PostgresAdapter from "@auth/pg-adapter";
import { pool } from "@/server/config/postgres";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Validation schema for credentials
const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const authOptions: NextAuthOptions = {
  adapter: PostgresAdapter(pool),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Validate credentials
          const validatedCredentials = credentialsSchema.parse(credentials);

          // Query user from database
          const result = await pool.query(
            "SELECT id, name, email, password FROM users WHERE email = $1",
            [validatedCredentials.email]
          );

          const user = result.rows[0];

          if (!user || !user.password) return null;

          // Verify password
          const isValidPassword = await bcrypt.compare(
            validatedCredentials.password,
            user.password
          );

          if (!isValidPassword) return null;

          // Return user object (without password)
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    // signOut: '/auth/signout',
    // error: '/auth/error',
    // verifyRequest: '/auth/verify-request',
    // newUser: '/auth/new-user'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session?.user) session.user.id = token.id as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
