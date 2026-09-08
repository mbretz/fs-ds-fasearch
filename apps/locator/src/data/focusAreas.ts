import { locations } from './locations';

export const focusAreas: string[] = [
  ...new Set(
    locations.flatMap((location) =>
      location.advisors.flatMap((advisor) => advisor.focusAreas),
    ),
  ),
].sort();
