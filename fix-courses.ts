import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.course.updateMany({
    where: { status: 'PUBLISHED' },
    data: { isPublished: true }
  });
  console.log('Fixed courses:', result.count);
}

main().catch(console.error).finally(() => prisma.$disconnect());
