import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient(); //.$extends(withAccelerate());

export default prisma;
