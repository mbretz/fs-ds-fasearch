import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const dsRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const componentsDir = join(dsRoot, 'src/components');

export interface ContractProp {
  name: string;
  type: string;
  values?: string[];
  required?: boolean;
  default?: unknown;
}
export interface ContractPart {
  usage: string;
  typeName: string;
  typesFile: string;
  cva?: string;
  props: ContractProp[];
  passthrough?: { from: string; only?: string[]; omit?: string[] };
}
export interface Contract {
  name: string;
  exports?: { component?: string; variants?: string[] };
  parts: ContractPart[];
}

export function componentNames(): string[] {
  return readdirSync(componentsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

export function contractPath(name: string): string {
  return join(componentsDir, name, `${name}.contract.json`);
}

export function loadContract(name: string): Contract | null {
  const p = contractPath(name);
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf-8')) : null;
}

export const aggregatePath = join(dsRoot, 'contracts/contracts.json');

/** All contracts in one file, for tooling (e.g. a consumer-side lint rule). */
export function buildAggregate(): string {
  const components: Record<string, Contract> = {};
  for (const name of componentNames()) {
    const c = loadContract(name);
    if (c) components[name] = c;
  }
  return JSON.stringify({ contractVersion: 1, components }, null, 2) + '\n';
}

export function createDsProgram(): ts.Program {
  const cfgPath = join(dsRoot, 'tsconfig.json');
  const cfg = ts.readConfigFile(cfgPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(cfg.config, ts.sys, dsRoot);
  return ts.createProgram(parsed.fileNames, parsed.options);
}

const isExternal = (sym: ts.Symbol) =>
  (sym.declarations ?? []).every((d) => {
    const f = d.getSourceFile().fileName;
    return f.includes('/node_modules/') || /\/typescript\/lib\//.test(f);
  });

function literalValues(checker: ts.TypeChecker, t: ts.Type): string[] | null {
  const nn = checker.getNonNullableType(t);
  const members = nn.isUnion() ? nn.types : [nn];
  const out: string[] = [];
  for (const m of members) {
    if (m.isStringLiteral()) out.push(m.value);
    else if (m.isNumberLiteral()) out.push(String(m.value));
    else return null;
  }
  return out;
}

function isBooleanType(checker: ts.TypeChecker, t: ts.Type): boolean {
  const nn = checker.getNonNullableType(t);
  return (nn.flags & ts.TypeFlags.BooleanLike) !== 0;
}

interface CvaInfo {
  variants: Record<string, string[]>;
  defaults: Record<string, string>;
}

function parseCva(file: ts.SourceFile, varName: string): CvaInfo | null {
  let result: CvaInfo | null = null;
  const propName = (n: ts.PropertyName) =>
    ts.isIdentifier(n) || ts.isStringLiteral(n) || ts.isNumericLiteral(n)
      ? n.text
      : null;
  const initText = (e: ts.Expression) =>
    e.kind === ts.SyntaxKind.TrueKeyword
      ? 'true'
      : e.kind === ts.SyntaxKind.FalseKeyword
        ? 'false'
        : ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)
          ? e.text
          : '';
  file.forEachChild(function visit(node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === varName &&
      node.initializer &&
      ts.isCallExpression(node.initializer)
    ) {
      const cfg = node.initializer.arguments[1];
      if (cfg && ts.isObjectLiteralExpression(cfg)) {
        const info: CvaInfo = { variants: {}, defaults: {} };
        for (const p of cfg.properties) {
          if (
            !ts.isPropertyAssignment(p) ||
            !ts.isObjectLiteralExpression(p.initializer)
          )
            continue;
          const key = propName(p.name);
          if (key === 'variants') {
            for (const v of p.initializer.properties) {
              if (
                !ts.isPropertyAssignment(v) ||
                !ts.isObjectLiteralExpression(v.initializer)
              )
                continue;
              const vk = propName(v.name);
              if (!vk) continue;
              info.variants[vk] = v.initializer.properties
                .filter(ts.isPropertyAssignment)
                .map((o) => propName(o.name))
                .filter((s): s is string => !!s);
            }
          } else if (key === 'defaultVariants') {
            for (const d of p.initializer.properties) {
              if (!ts.isPropertyAssignment(d)) continue;
              const dk = propName(d.name);
              if (dk) info.defaults[dk] = initText(d.initializer);
            }
          }
        }
        result = info;
      }
    }
    node.forEachChild(visit);
  });
  return result;
}

export function checkContract(
  program: ts.Program,
  contract: Contract,
): string[] {
  const errors: string[] = [];
  const checker = program.getTypeChecker();
  const dir = join(componentsDir, contract.name);
  const err = (m: string) => errors.push(`${contract.name}: ${m}`);

  for (const part of contract.parts) {
    const at = `${part.usage}`;
    const sf = program.getSourceFile(join(dir, part.typesFile));
    const modSym = sf && checker.getSymbolAtLocation(sf);
    let sym =
      modSym &&
      checker.getExportsOfModule(modSym).find((s) => s.name === part.typeName);
    if (!sym) {
      err(`${at}: type ${part.typeName} not exported from ${part.typesFile}`);
      continue;
    }
    if (sym.flags & ts.SymbolFlags.Alias) sym = checker.getAliasedSymbol(sym);
    const type = checker.getDeclaredTypeOfSymbol(sym);
    const typeProps = checker.getPropertiesOfType(type);
    const byName = new Map(typeProps.map((p) => [p.name, p]));
    const listed = new Map(part.props.map((p) => [p.name, p]));

    for (const p of typeProps) {
      if (!isExternal(p) && !listed.has(p.name)) {
        err(
          `${at}: prop "${p.name}" exists in code but is missing from the contract`,
        );
      }
      if (
        isExternal(p) &&
        part.passthrough?.only &&
        !part.passthrough.only.includes(p.name) &&
        !listed.has(p.name)
      ) {
        err(
          `${at}: passthrough prop "${p.name}" exists in code but is not in passthrough.only`,
        );
      }
    }
    for (const k of part.passthrough?.only ?? []) {
      if (!byName.has(k))
        err(
          `${at}: passthrough.only lists "${k}" which is not on ${part.typeName}`,
        );
    }

    for (const cp of part.props) {
      const sp = byName.get(cp.name);
      if (!sp) {
        err(
          `${at}: contract lists prop "${cp.name}" which is not on ${part.typeName}`,
        );
        continue;
      }
      const t = checker.getTypeOfSymbol(sp);
      const optional = (sp.flags & ts.SymbolFlags.Optional) !== 0;
      if (!!cp.required === optional) {
        err(`${at}.${cp.name}: required should be ${!optional}`);
      }
      if (cp.type === 'enum') {
        const lits = literalValues(checker, t);
        if (!lits)
          err(
            `${at}.${cp.name}: contract says enum but code type is not a literal union`,
          );
        else if (
          [...lits].sort().join('|') !== [...(cp.values ?? [])].sort().join('|')
        ) {
          err(
            `${at}.${cp.name}: values ${JSON.stringify(cp.values)} != code ${JSON.stringify(lits)}`,
          );
        }
      } else if (cp.type === 'boolean' && !isBooleanType(checker, t)) {
        err(
          `${at}.${cp.name}: contract says boolean but code type is ${checker.typeToString(t)}`,
        );
      } else if (
        cp.type === 'string' &&
        (checker.getNonNullableType(t).flags & ts.TypeFlags.StringLike) === 0
      ) {
        err(
          `${at}.${cp.name}: contract says string but code type is ${checker.typeToString(t)}`,
        );
      }
    }

    if (part.cva) {
      const compFile = program.getSourceFile(join(dir, `${contract.name}.tsx`));
      const info = compFile && parseCva(compFile, part.cva);
      if (!info) {
        err(`${at}: cva "${part.cva}" not found in ${contract.name}.tsx`);
      } else {
        for (const [vk, opts] of Object.entries(info.variants)) {
          const cp = listed.get(vk);
          if (!cp) {
            err(
              `${at}: cva variant "${vk}" has no matching prop in the contract`,
            );
            continue;
          }
          const expected =
            cp.type === 'boolean'
              ? ['false', 'true']
              : [...(cp.values ?? [])].sort();
          const actual = [...opts].sort();
          const ok =
            cp.type === 'boolean'
              ? actual.every((o) => expected.includes(o))
              : expected.join('|') === actual.join('|');
          if (!ok)
            err(
              `${at}.${vk}: cva options ${JSON.stringify(actual)} != contract ${JSON.stringify(expected)}`,
            );
          const def = info.defaults[vk];
          if (def !== undefined && String(cp.default) !== def) {
            err(
              `${at}.${vk}: cva default "${def}" != contract default ${JSON.stringify(cp.default)}`,
            );
          }
        }
      }
    }
  }

  // Public exports + dotted sub-parts.
  const idx = program.getSourceFile(join(dsRoot, 'src/index.ts'));
  const idxSym = idx && checker.getSymbolAtLocation(idx);
  const exported = new Map(
    idxSym ? checker.getExportsOfModule(idxSym).map((s) => [s.name, s]) : [],
  );
  for (const n of [
    contract.exports?.component,
    ...(contract.exports?.variants ?? []),
  ]) {
    if (n && !exported.has(n)) err(`"${n}" is not exported from src/index.ts`);
  }
  const compSym =
    contract.exports?.component && exported.get(contract.exports.component);
  if (compSym) {
    const target =
      compSym.flags & ts.SymbolFlags.Alias
        ? checker.getAliasedSymbol(compSym)
        : compSym;
    const ct = checker.getTypeOfSymbol(target);
    for (const part of contract.parts) {
      const [, sub] = part.usage.split('.');
      if (sub && !checker.getPropertyOfType(ct, sub)) {
        err(`${part.usage}: ${contract.name} has no member "${sub}"`);
      }
    }
  }
  return errors;
}
