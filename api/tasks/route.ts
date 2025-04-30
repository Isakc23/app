import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
const { title } = await req.json();

if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

const task = await prisma.task.create({
    data: {
        title,
        user: {
            connect: { email: session.user.email }
        }
    }
});

return NextResponse.json(task);
}
