import fs from "node:fs"
import path from "node:path"

const ENV_FILES = [".env", ".env.local"] as const

export function loadProjectEnv() {
  for (const envFile of ENV_FILES) {
    const envPath = path.resolve(process.cwd(), envFile)

    if (fs.existsSync(envPath)) {
      process.loadEnvFile(envPath)
    }
  }
}
