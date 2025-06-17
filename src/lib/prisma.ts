import { PrismaClient } from "../generated/prisma";
// import { PrismaClient } from "@prisma-app/client";
// import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient(); //.$extends(withAccelerate());

export default prisma;
