import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      login: string;
      accessToken: string;
    };
  }
}
