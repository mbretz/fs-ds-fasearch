import IconBriefcase from '../../assets/icons/IconBriefcase';
import { cn } from '../../utils/cn';

export interface TenureLineProps {
  years: number;
  className?: string;
}

// Figma pairs this with an "icon-briefcase" glyph -- packages/icons has no
// equivalent, so this uses the locator-local stand-in (see
// src/assets/icons/README.md) rather than a mismatched generic icon or
// going text-only.
//
// Grid, not flex -- same `BranchTeamMemberRow` precedent (see its own
// comment): a plain `inline-flex items-center` centers the icon against the
// *whole* span, which is correct for one line but sinks the icon once
// "X years at Edward Jones" wraps to two at narrow card widths. `items-start`
// alone over-corrects the other way (icon pinned to the block's literal top
// edge, above the text's own cap-height). `[text-box:trim-both_cap_alphabetic]`
// -- BranchTeamMemberRow's own precision trick -- strips the text span's
// invisible line-height leading down to its visible cap-height/baseline
// box first, so the icon's `self-start` + this measured top offset lands
// against real glyph ink, not a leading-padded line box (which is what
// made an earlier, purely math-derived margin -- half of line-height minus
// icon size -- measurably wrong: confirmed via a Playwright bounding-box
// comparison, not assumed). Firefox (no `text-box` support) falls back to
// the untrimmed box; the offset below still reads close there, just not
// pixel-exact.
export function TenureLine({ years, className }: TenureLineProps) {
  return (
    <span
      className={cn(
        'grid grid-cols-[auto_1fr] items-start gap-x-[var(--density-spacing-fixed-x-small)]',
        className,
      )}
    >
      <IconBriefcase
        aria-hidden="true"
        className="mt-[-3px] size-[var(--density-sizing-fixed-large)] shrink-0 self-start"
      />
      <span className="text-[length:var(--semantic-content-microcopy-font-size)] leading-[length:var(--semantic-content-microcopy-line-height)] font-[number:var(--semantic-content-microcopy-font-weight)] text-[color:var(--semantic-content-common-text-color-default)] [text-box:trim-both_cap_alphabetic]">
        {years} {years === 1 ? 'year' : 'years'} at Edward Jones
      </span>
    </span>
  );
}
