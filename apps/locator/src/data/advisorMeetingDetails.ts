import type { Advisor } from './locations';

export interface AdvisorMeetingDetails {
  minimumInvestment: string;
  meetingAvailability: string[];
}

/**
 * Fictional meeting-details criteria for profile pages, keyed by
 * Advisor.id -- same rationale/precedent as advisorBios.ts and
 * advisorEducation.ts. Only present for advisors with
 * `newClientStatus === 'accepting'` (per the user, the Meeting Details
 * section itself only renders for those advisors) -- fixture advisors
 * who aren't accepting new clients intentionally have no entry here.
 */
export const advisorMeetingDetails: Partial<
  Record<Advisor['id'], AdvisorMeetingDetails>
> = {
  'adv-1': {
    minimumInvestment: '$100,000',
    meetingAvailability: ['In-Person', 'Virtual'],
  },
  'adv-2': {
    minimumInvestment: '$250,000',
    meetingAvailability: ['In-Person', 'Virtual', 'Phone'],
  },
  'adv-5': {
    minimumInvestment: '$150,000',
    meetingAvailability: ['In-Person', 'Virtual'],
  },
  'adv-6': {
    minimumInvestment: '$250,000',
    meetingAvailability: ['Virtual', 'Phone'],
  },
  'adv-8': {
    minimumInvestment: '$100,000',
    meetingAvailability: ['In-Person', 'Virtual'],
  },
  'adv-9': {
    minimumInvestment: '$150,000',
    meetingAvailability: ['In-Person', 'Virtual', 'Phone'],
  },
  'adv-10': {
    minimumInvestment: '$500,000',
    meetingAvailability: ['In-Person', 'Virtual'],
  },
  'adv-12': {
    minimumInvestment: '$150,000',
    meetingAvailability: ['In-Person', 'Virtual'],
  },
  'adv-13': {
    minimumInvestment: '$250,000',
    meetingAvailability: ['In-Person Only'],
  },
  'adv-15': {
    minimumInvestment: '$100,000',
    meetingAvailability: ['In-Person', 'Virtual', 'Phone'],
  },
  'adv-16': {
    minimumInvestment: '$500,000',
    meetingAvailability: ['In-Person', 'Virtual'],
  },
  'adv-18': {
    minimumInvestment: '$100,000',
    meetingAvailability: ['Virtual', 'Phone'],
  },
  'adv-19': {
    minimumInvestment: '$150,000',
    meetingAvailability: ['In-Person', 'Virtual'],
  },
  'adv-21': {
    minimumInvestment: '$250,000',
    meetingAvailability: ['In-Person', 'Virtual'],
  },
  'adv-22': {
    minimumInvestment: '$100,000',
    meetingAvailability: ['In-Person', 'Virtual', 'Phone'],
  },
  'adv-24': {
    minimumInvestment: '$150,000',
    meetingAvailability: ['In-Person', 'Virtual'],
  },
  'adv-26': {
    minimumInvestment: '$100,000',
    meetingAvailability: ['Virtual Only'],
  },
  'adv-28': {
    minimumInvestment: '$250,000',
    meetingAvailability: ['In-Person', 'Virtual'],
  },
  'adv-29': {
    minimumInvestment: '$150,000',
    meetingAvailability: ['In-Person', 'Virtual', 'Phone'],
  },
  'adv-30': {
    minimumInvestment: '$100,000',
    meetingAvailability: ['In-Person', 'Virtual'],
  },
  'adv-33': {
    minimumInvestment: '$250,000',
    meetingAvailability: ['In-Person', 'Virtual'],
  },
  'adv-34': {
    minimumInvestment: '$500,000',
    meetingAvailability: ['In-Person', 'Virtual', 'Phone'],
  },
};
