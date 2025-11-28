import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { sql } from "@vercel/postgres";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    // NO pongas maxAge aquí, lo gestionamos en cookies
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        // 🔑 CLAVE: Sin expires ni maxAge = cookie de sesión
        // Se elimina al cerrar TODAS las pestañas del navegador
      },
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { rows } = await sql`
          SELECT id, name, email, password_hash
          FROM users
          WHERE email = ${credentials.email}
          LIMIT 1;
        `;

        const user = rows[0];
        if (!user) return null;

        const hash = String(user.password_hash).trim();
        const valid = await bcrypt.compare(credentials.password, hash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
  
  events: {
    // Opcional: log cuando la sesión termina
    async signOut() {
      console.log("Sesión cerrada");
    },
  },
};