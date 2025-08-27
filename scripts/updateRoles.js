const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`UPDATE "users" SET role = 'owner' WHERE role IN ('admin','seller');`);
  console.log('Roles updated to owner');
}

main()
  .catch((e) => {
    console.error('Error updating roles', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
