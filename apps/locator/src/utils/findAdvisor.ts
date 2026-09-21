import { locations, type Advisor, type Location } from '../data/locations';

export interface FoundAdvisor {
  advisor: Advisor;
  /** The advisor's branch -- an advisor has no separate office of their
   * own, same fallback AdvisorCard already relies on. */
  location: Location;
}

export function findAdvisorById(id: string): FoundAdvisor | undefined {
  for (const location of locations) {
    const advisor = location.advisors.find((candidate) => candidate.id === id);
    if (advisor) return { advisor, location };
  }
  return undefined;
}

export function findLocationById(id: string): Location | undefined {
  return locations.find((location) => location.id === id);
}
