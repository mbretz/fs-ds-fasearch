# Using the `ds` design system (agent rules)

Every component has a contract: `src/components/<Name>/<Name>.contract.md` (readable) generated from `<Name>.contract.json` (source of truth). All contracts are also in `contracts/contracts.json`.

1. **Read the component's contract before using it.** Use only the parts, props, variants, enum values, defaults and children it lists.
2. **Never invent** props, variant values, sizes, colors or sub-components. If a contract's "Not supported" list or the absence of an option says it doesn't exist, it doesn't. Pick the closest supported option or ask the user.
3. **Follow the contract's constraints** (required props, composition parents, a11y rules).
4. **Prefer the listed components** over hand-rolled markup or one-off classes; use `className` only where the contract says it is merged, and not to recreate a missing variant.
5. **When changing a component**, update its `.contract.json` in the same change and run `pnpm --filter ds contracts:build`. `pnpm --filter ds test` fails if a contract and the code disagree.
