/**
 * Apply sample CMS data (projects, copy, nav links, etc.). Leaves contact form submissions
 * untouched. Does not run automatically — invoke with `pnpm run db:seed` (or
 * `pnpm exec prisma db seed`) after `db push` / migrations.
 */
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
