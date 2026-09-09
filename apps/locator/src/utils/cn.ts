import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Mirrors packages/ds/src/utils/cn.ts — same clsx + tailwind-merge combo,
// duplicated locally since apps/locator doesn't import ds's internal utils.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
