import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function main() {
  const email = 'bilmarmarketing@gmail.com';
  const password = '6*2Mqub5KzvLn43P';

  // Find user
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    console.log('❌ User not found!');
    return;
  }

  console.log('\n✅ User found in database:');
  console.log(`Email: ${user.email}`);
  console.log(`Name: ${user.name}`);
  console.log(`Email Verified: ${user.emailVerified}`);
  console.log(`User ID: ${user.id}`);

  // Test password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (isPasswordValid) {
    console.log('\n✅ Password matches!');
  } else {
    console.log('\n❌ Password does NOT match!');
    console.log('Stored hash:', user.passwordHash);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
