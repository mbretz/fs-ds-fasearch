import { writeFileSync } from 'node:fs';
import {
  aggregatePath,
  buildAggregate,
  componentNames,
  contractPath,
  loadContract,
} from '../src/contracts/check.ts';
import { renderContract } from '../src/contracts/render.ts';

let n = 0;
for (const name of componentNames()) {
  const contract = loadContract(name);
  if (!contract) continue;
  writeFileSync(
    contractPath(name).replace(/\.json$/, '.md'),
    renderContract(contract),
  );
  n++;
}
writeFileSync(aggregatePath, buildAggregate());
console.log(`Rendered ${n} contract(s).`);
