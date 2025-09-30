import { prisma } from './lib/prisma';

async function seed() {
  console.log('🌱 Starting seed...');

  // Criar varal inicial
  const clothesline = await prisma.clothesline.create({
    // where: { name: 'Varal Principal' },
    // update: {},
    data: {
      name: 'Varal Principal',
      status: 'CLOSED',
    },
  });

  console.log('✅ Clothesline created:', clothesline);

  // Criar algumas ações de exemplo
  const actions = await Promise.all([
    prisma.actionsLog.create({
      data: {
        clotheslineId: clothesline.id,
        actionType: 'OPEN',
        actionOrigin: 'SYSTEM',
        humidity: 45.0,
      },
    }),
    prisma.actionsLog.create({
      data: {
        clotheslineId: clothesline.id,
        actionType: 'CLOSE',
        actionOrigin: 'ARDUINO',
        humidity: 82.5,
      },
    }),
  ]);

  console.log('✅ Sample actions created:', actions.length);
  console.log('🎉 Seed completed!');
}

seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });