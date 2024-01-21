import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        login: { label: "login", type: "text", placeholder: "login" },
        password: { label: "password", type: "password", placeholder: "password" },
      },
      async authorize(credentials, req) {
        const res = await fetch("http://localhost:8080/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            login: credentials?.login,
            password: credentials?.password,
          }),
        });
        const user = await res.json();

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user = token as any;
      return session;
    },
  },
});
