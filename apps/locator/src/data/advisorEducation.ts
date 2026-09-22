import type { Advisor } from './locations';

export interface AdvisorEducation {
  school: string;
  degree: string;
}

/**
 * Fictional education history for profile pages, keyed by Advisor.id --
 * same rationale/precedent as advisorBios.ts (kept separate from
 * locations.ts so the fixture used everywhere else stays free of this
 * profile-only data).
 */
export const advisorEducation: Record<Advisor['id'], AdvisorEducation> = {
  'adv-1': {
    school: 'University of Missouri',
    degree: 'Bachelor of Science in Finance',
  },
  'adv-2': {
    school: 'Washington University in St. Louis',
    degree: 'Bachelor of Science in Business Administration',
  },
  'adv-3': {
    school: 'Saint Louis University',
    degree: 'Bachelor of Science in Accounting',
  },
  'adv-4': {
    school: 'University of Illinois Urbana-Champaign',
    degree: 'Bachelor of Science in Finance',
  },
  'adv-5': {
    school: 'Truman State University',
    degree: 'Bachelor of Science in Business Administration',
  },
  'adv-6': {
    school: 'University of Kansas',
    degree: 'Bachelor of Science in Economics',
  },
  'adv-7': {
    school: 'Indiana University Bloomington',
    degree: 'Bachelor of Science in Finance',
  },
  'adv-8': {
    school: 'University of Missouri-Kansas City',
    degree: 'Bachelor of Science in Accounting',
  },
  'adv-9': {
    school: 'Southern Illinois University Edwardsville',
    degree: 'Bachelor of Science in Business Administration',
  },
  'adv-10': {
    school: 'University of Iowa',
    degree: 'Bachelor of Business Administration',
  },
  'adv-11': {
    school: 'Missouri State University',
    degree: 'Bachelor of Science in Finance',
  },
  'adv-12': {
    school: 'University of Nebraska-Lincoln',
    degree: 'Bachelor of Science in Economics',
  },
  'adv-13': {
    school: 'Illinois State University',
    degree: 'Bachelor of Science in Finance',
  },
  'adv-14': {
    school: 'University of Arkansas',
    degree: 'Bachelor of Science in Business Administration',
  },
  'adv-15': {
    school: 'Drury University',
    degree: 'Bachelor of Science in Accounting',
  },
  'adv-16': {
    school: 'University of Notre Dame',
    degree: 'Bachelor of Business Administration',
  },
  'adv-17': {
    school: 'University of Wisconsin-Madison',
    degree: 'Bachelor of Science in Finance',
  },
  'adv-18': {
    school: 'Purdue University',
    degree: 'Bachelor of Science in Economics',
  },
  'adv-19': {
    school: 'University of Central Missouri',
    degree: 'Bachelor of Science in Business Administration',
  },
  'adv-20': {
    school: 'Miami University',
    degree: 'Bachelor of Science in Finance',
  },
  'adv-21': {
    school: 'Baylor University',
    degree: 'Bachelor of Business Administration',
  },
  'adv-22': {
    school: 'University of Oklahoma',
    degree: 'Bachelor of Science in Accounting',
  },
  'adv-23': {
    school: 'University of Minnesota',
    degree: 'Bachelor of Science in Finance',
  },
  'adv-24': {
    school: 'Ohio State University',
    degree: 'Bachelor of Science in Business Administration',
  },
  'adv-25': {
    school: 'University of Colorado Boulder',
    degree: 'Bachelor of Science in Finance',
  },
  'adv-26': {
    school: 'Howard University',
    degree: 'Bachelor of Business Administration',
  },
  'adv-27': {
    school: 'University of Michigan',
    degree: 'Bachelor of Science in Economics',
  },
  'adv-28': {
    school: 'University of Texas at Austin',
    degree: 'Bachelor of Business Administration',
  },
  'adv-29': {
    school: 'Creighton University',
    degree: 'Bachelor of Science in Finance',
  },
  'adv-30': {
    school: 'Marquette University',
    degree: 'Bachelor of Science in Accounting',
  },
  'adv-31': {
    school: 'University of Georgia',
    degree: 'Bachelor of Business Administration',
  },
  'adv-32': {
    school: 'Vanderbilt University',
    degree: 'Bachelor of Science in Economics',
  },
  'adv-33': {
    school: 'Villanova University',
    degree: 'Bachelor of Science in Finance',
  },
  'adv-34': {
    school: 'Michigan State University',
    degree: 'Bachelor of Science in Business Administration',
  },
};
