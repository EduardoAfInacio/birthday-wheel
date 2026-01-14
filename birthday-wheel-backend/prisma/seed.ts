import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  await prisma.userSpinSession.deleteMany();
  await prisma.qrToken.deleteMany();
  await prisma.prize.deleteMany();

  console.log('🧹 Database cleaned.');

  console.log('👮 Creating Admin...');
  const password = await bcrypt.hash('admin123', 10);

  await prisma.admin.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: password,
    },
  });

  const prizesData = [
    {
      name: '5% OFF',
      description: 'Simple discount',
      color: '#A0C4FF',
      weight: 10,
    },
    {
      name: '10% OFF',
      description: 'Standard discount',
      color: '#9BF6FF',
      weight: 5,
    },
    {
      name: 'Free Shipping',
      description: 'Valid nationwide',
      color: '#CAFFBF',
      weight: 3,
    },
    {
      name: 'Mystery Gift',
      description: 'Pick up at counter',
      color: '#FFADAD',
      weight: 2,
    },
    {
      name: '50% OFF',
      description: 'Super discount!',
      color: '#FDFFB6',
      weight: 1,
    },
    {
      name: 'Try Again',
      description: 'Better luck next time',
      color: '#F0F0F0',
      weight: 8,
      isLoss: true, // Importante para a lógica do jogo
    },
  ];

  console.log('🎁 Creating Prizes...');

  for (const p of prizesData) {
    await prisma.prize.create({
      data: {
        name: p.name,
        description: p.description,
        color: p.color,
        weight: p.weight,
        price: 0,
        stock: 99999,
        initialStock: 99999,
        isActive: true,
        // Se p.isLoss for undefined, usa false
        isLoss: (p as any).isLoss || false,
      },
    });
  }

  // 4. CREATE QR TOKENS
  const tokens = ['TEST01', 'TEST02', 'TEST03', 'TEST04', 'TEST05', 'TEST06'];

  console.log('🎫 Creating QR Tokens...');

  for (const code of tokens) {
    await prisma.qrToken.create({
      data: {
        code: code,
        description: `Test Token - ${code}`,
        isActive: true,
      },
    });
  }

  console.log('✅ Seed finished successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
