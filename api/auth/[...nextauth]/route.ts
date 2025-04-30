import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

// Define authOptions
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: { email: credentials?.email || "" },
                });

                if (!user) return null;

                const isValid = credentials ? await compare(credentials.password, user.password) : false;
                return isValid ? user : null;
            },
        }),
    ],
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,
};

// Use authOptions in the handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
