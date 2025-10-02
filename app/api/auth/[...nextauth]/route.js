import NextAuth from "next-auth";
import { serverAuthOptions } from "@/lib/auth";

// Normally, App Router API routes require route.js (or route.ts) to define functions like GET, POST, PUT, etc. But [...nextauth].js is a special case because NextAuth exports the handler directly — the framework treats it correctly without needing route.js.
const handler = NextAuth(serverAuthOptions);
export { handler as GET, handler as POST };
