import { fileURLToPath } from 'node:url'
import path from 'node:path'


export const dirname = path.dirname(fileURLToPath(import.meta.url))

