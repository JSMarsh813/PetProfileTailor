import NextAuth from "next-auth";
import { serverAuthOptions } from "@/lib/auth";

export default NextAuth(serverAuthOptions);
