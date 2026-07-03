import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  const department = await prisma.department.create({
    data: {
      faculty: "Engineering",
      major: "Computer Science",
    },
  });

  const profile = await prisma.profile.create({
    data: {
      firstName: "Halley",
      lastName: "Sakrit",
      year: "4",
      departmentId: department.id,
    },
  });

  const post = await prisma.post.create({
    data: {
      title: "My first post",
      content: "Hello Prisma",
      mood: "happy",
      authorId: profile.id,
    },
  });

  console.log({ department, profile, post });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());