import type { Contract } from './check';

// Loose view of the optional fields the checker doesn't need.
type Json = Record<string, any>;

const cell = (s: unknown) => String(s ?? '').replace(/\|/g, '\\|');
const code = (s: unknown) => '`' + String(s) + '`';

export function renderContract(contract: Contract & Json): string {
  const out: string[] = [];
  out.push(
    '<!-- GENERATED from ' +
      contract.name +
      '.contract.json by `pnpm --filter ds contracts:build`. Do not edit. -->',
    '',
    `# ${contract.name} contract`,
    '',
    contract.summary,
    '',
    '**Only the props, variants and values listed here exist. Do not invent others.**',
    '',
  );
  if (contract.spec)
    out.push(`Spec: [${contract.spec}](./${contract.spec})`, '');
  if (contract.exports?.component) {
    out.push(
      `Import: ${code(`import { ${[contract.exports.component, ...(contract.exports.variants ?? [])].join(', ')} } from 'ds'`)}`,
      '',
    );
  }
  for (const part of contract.parts as Json[]) {
    out.push(`## ${code('<' + part.usage + '>')}`, '');
    out.push(
      `Renders ${code(part.renders)}.${part.description ? ' ' + part.description : ''}`,
      '',
    );
    if (part.props.length) {
      out.push(
        '| Prop | Type | Values | Default | Notes |',
        '| --- | --- | --- | --- | --- |',
      );
      for (const p of part.props as Json[]) {
        const vals = p.values ? p.values.map(code).join(', ') : '';
        const def =
          p.default === undefined ? '' : code(JSON.stringify(p.default));
        out.push(
          `| ${code(p.name)}${p.required ? ' *' : ''} | ${p.type} | ${vals} | ${def} | ${cell(p.description)} |`,
        );
      }
      out.push('', '\\* required', '');
    } else {
      out.push('No component-specific props.', '');
    }
    const pt = part.passthrough as Json | undefined;
    if (pt) {
      out.push(
        `- Passthrough: ${code(pt.from)}${pt.only ? ` — only ${pt.only.map(code).join(', ')}` : ''}${pt.omit?.length ? ` — omits ${pt.omit.map(code).join(', ')}` : ''}${pt.note ? `. ${pt.note}` : ''}`,
      );
    }
    out.push(
      `- ref: ${part.ref === false ? 'no' : 'yes'}; className: ${part.className === 'none' ? 'not accepted' : 'merged with component classes'}`,
    );
    if (part.children) {
      const a = part.children.allowed;
      out.push(
        `- children: ${Array.isArray(a) ? a.map(code).join(', ') : (a ?? 'any')}${part.children.note ? ` — ${part.children.note}` : ''}`,
      );
    }
    out.push('');
  }
  const constraints = (contract.constraints ?? []) as Json[];
  if (constraints.length) {
    out.push('## Constraints', '');
    for (const c of constraints)
      out.push(
        `- **${c.kind}**${c.part ? ` (${code(c.part)})` : ''}: ${c.rule}`,
      );
    out.push('');
  }
  const ns = (contract.notSupported ?? []) as string[];
  if (ns.length) {
    out.push('## Not supported', '', ...ns.map((s) => `- ${s}`), '');
  }
  return out.join('\n');
}
