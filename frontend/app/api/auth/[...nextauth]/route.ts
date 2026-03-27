import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
   async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // ✅ If callbackUrl is provided → use it
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      // ✅ If same origin → allow
      if (new URL(url).origin === baseUrl) {
        return url;
      }

      // 🔥 Default → go to login (NOT landing)
      return `${baseUrl}/login`;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };