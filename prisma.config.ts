import { defineConfig } from "prisma/config"

import { loadProjectEnv } from "./lib/load-env"

loadProjectEnv()

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "node --import tsx prisma/seed.ts",
  },
})
