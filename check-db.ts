import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const courses = await prisma.course.findMany({ select: { id: true, title: true, isPublished: true, status: true } });
  console.log('Courses Status:', JSON.stringify(courses, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
