import NextAuth from "next-auth";
import { authOptions } from "./authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcrypt";
// import { sql } from "@vercel/postgres";

// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: {},
//         password: {},
//       },

//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           console.log("Faltan credenciales");
//           return null;
//         }
        
//         const test = await bcrypt.compare("password", "$2a$12$noBUubMbmrewhsuLyadNiuWMxvTRcYRY7ydVNH197rSL9fAqldqMW");
//         console.log("TEST HASH STATIC:", test);

//         console.log("EMAIL RECIBIDO:", credentials.email);
//         console.log("PASSWORD RECIBIDO:", credentials.password);
//         console.log("PASSWORD CHARS:", credentials.password.split("").map(c => c.charCodeAt(0)));

//         const { rows } = await sql`
//           SELECT id, name, email, password_hash
//           FROM users
//           WHERE email = ${credentials.email}
//           LIMIT 1;
//         `;

//         console.log("ROW RESULT:", rows);

//         const user = rows[0];
//         if (!user) {
//           console.log("Usuario no encontrado");
//           return null;
//         }


//         // PROTECCIÓN: eliminar saltos de línea
//         const hash = (user.password_hash ?? "").trim();
//         console.log("HASH RAW:", user.password_hash);
//         console.log("HASH LENGTH:", user.password_hash.length);

//         const passwordCorrecta = await bcrypt.compare(
//           credentials.password,
//           hash
//         );

//         console.log("¿PASSWORD CORRECTO?:", passwordCorrecta);


//         if (!passwordCorrecta) {
//           console.log("Contraseña incorrecta");
//           return null;
//         }

//         console.log("LOGIN OK", user);

//         return {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//         };
//       }
//     }),
//   ],

//   pages: {
//     signIn: "/login",
//     error: "/login",
//   },

//   session: { strategy: "jwt" },

//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.name = user.name;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id;
//         session.user.name = token.name;
//       }
//       return session;
//     },
//   },
// });

// export { handler as GET, handler as POST };
