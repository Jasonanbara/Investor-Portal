// Creates an index.ts barrel file for the generated Prisma client
// Prisma v7 generates client.ts but no index.ts, which Turbopack needs to resolve bare imports
import { writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const generatedDir = join(__dirname, '..', 'src', 'generated', 'prisma');
const indexPath = join(generatedDir, 'index.ts');

if (existsSync(join(generatedDir, 'client.ts'))) {
  writeFileSync(indexPath, 'export * from "./client";\n');
  console.log('✅ Created prisma barrel file: src/generated/prisma/index.ts');
} else {
  console.warn('⚠️ Prisma client.ts not found — skipping barrel file creation');
}
