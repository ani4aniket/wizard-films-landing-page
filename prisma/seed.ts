import { replaceCmsWithSampleData } from "../lib/crm-defaults"
import { prisma } from "../lib/prisma"

async function main() {
  await replaceCmsWithSampleData()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
