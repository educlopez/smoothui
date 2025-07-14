import { promises as fs } from "fs"
import path from "path"

export async function readComponentSource(componentPath: string) {
  const fullPath = path.join(process.cwd(), componentPath)
  return await fs.readFile(fullPath, "utf-8")
}
