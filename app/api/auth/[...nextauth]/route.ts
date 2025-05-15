import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { userService } from "@/app/services/userService";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, account, profile, trigger }) {
      // The user object is only passed on initial sign in
      if (user) {
        token.id = user.id;
        
        try {
          // Check if this user already exists in our Supabase database
          const userExists = await userService.checkUserExists(user.id);
          
          // Store this flag in the token to use in the session callback
          token.isFirstLogin = !userExists;
        } catch (error) {
          console.error("Error checking if user exists:", error);
          // Default to false (treat as first login) in case of error
          token.isFirstLogin = true;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      // Add user ID to the session
      if (session.user && token.sub) {
        session.user.id = token.sub;
        
        try {
          // First, verify Supabase connection is working
          const connectionValid = await userService.checkConnection();
          if (!connectionValid) {
            console.error('Supabase connection check failed. Skipping database operations.');
            return session;
          }
          
          // If this is the user's first login, store their details in Supabase
          if (token.isFirstLogin) {
            await userService.upsertUser({
              id: token.sub,
              email: session.user.email || '',
              name: session.user.name ?? null,
              image: session.user.image ?? null,
            });
            
            // Remove the flag after handling the first login
            delete token.isFirstLogin;
          } else {
            // Update the last login time for returning users
            await userService.updateLastLogin(token.sub);
          }
        } catch (error) {
          console.error("Error during user database operations:", error);
          // Continue the authentication flow even if database operations fail
        }
      }
      
      return session;
    },
  },
});

export { handler as GET, handler as POST };
