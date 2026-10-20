import { readFileSync, existsSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import type ts from 'typescript';
import {
  checkContract,
  componentNames,
  createDsProgram,
  contractPath,
  loadContract,
  aggregatePath,
  buildAggregate,
} from './check';
import { renderContract } from './render';

describe('component contracts', () => {
  let program: ts.Program;
  beforeAll(() => {
    program = createDsProgram();
  }, 60_000);

  for (const name of componentNames()) {
    it(`${name} contract matches the code`, () => {
      const contract = loadContract(name);
      expect(contract, `missing ${name}.contract.json`).not.toBeNull();
      expect(checkContract(program, contract!)).toEqual([]);
    }, 60_000);

    it(`${name} .contract.md is up to date`, () => {
      const contract = loadContract(name)!;
      const mdPath = contractPath(name).replace(/\.json$/, '.md');
      expect(existsSync(mdPath), 'run pnpm --filter ds contracts:build').toBe(
        true,
      );
      expect(
        readFileSync(mdPath, 'utf-8'),
        'run pnpm --filter ds contracts:build',
      ).toBe(renderContract(contract));
    });
  }

  it('contracts/contracts.json is up to date', () => {
    expect(
      readFileSync(aggregatePath, 'utf-8'),
      'run pnpm --filter ds contracts:build',
    ).toBe(buildAggregate());
  });
});
