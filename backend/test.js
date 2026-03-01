require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const link = await prisma.link.create({
    data: {
      original: "https://google.com",
      shortCode: "abc123",
    },
  });

  console.log(link);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());