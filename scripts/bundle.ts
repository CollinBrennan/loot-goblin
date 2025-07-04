import { $ } from 'bun';
import fs from 'fs';
import archiver from 'archiver';

const name = Bun.argv[2];
if (!name) process.exit(1);

await $`mkdir -p dist`;
await $`bun build lambda/${name}.ts --target node --format esm --outfile dist/index.mjs`;

await new Promise<void>((resolve, reject) => {
  const output = fs.createWriteStream(`dist/${name}.zip`);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', resolve);
  archive.on('error', reject);

  archive.pipe(output);
  archive.file('dist/index.mjs', { name: 'index.mjs' });
  archive.finalize();
});
