export type NewClientStatus = 'accepting' | 'waitlist' | 'referralOnly';

export type BranchStaffTitle =
  | 'Branch Office Administrator'
  | 'Senior Branch Office Administrator';

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type DayHours =
  | { status: 'open'; opens: string; closes: string }
  | { status: 'byAppointment' }
  | { status: 'closed' };

export type WeeklyHours = Record<DayOfWeek, DayHours>;

export interface BranchSupportStaff {
  id: string;
  name: string;
  /** Optional — Avatar renders initials when no photo is on file. */
  photoUrl?: string;
  title: BranchStaffTitle;
}

export interface Advisor {
  id: string;
  name: string;
  title: string;
  photoUrl: string;
  newClientStatus: NewClientStatus;
  focusAreas: string[];
  /** Professional designations/accreditations, e.g. CFP®, CFA. */
  designations: string[];
  /** Years at the company. */
  tenureYears: number;
  linkedIn: boolean;
  facebook: boolean;
  /** Short list for the profile bio's "outside the office" section. */
  personalInterests: string[];
  /**
   * Per-day schedule. Omitted when the advisor keeps the same hours as
   * their location (the common case) — callers should fall back to
   * `Location.hours` when this is undefined, rather than duplicating it
   * here. Only set explicitly when an advisor's hours genuinely diverge
   * from the branch (multi-advisor locations, reduced schedules, etc).
   */
  hours?: WeeklyHours;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  hours: string;
  open: boolean;
  advisors: Advisor[];
  supportStaff: BranchSupportStaff[];
}

export const locations: Location[] = [
  {
    id: 'loc-1',
    name: 'St. Louis Downtown',
    address: '211 N Broadway, St. Louis, MO 63102',
    lat: 38.6273,
    lng: -90.1889,
    hours: 'Mon–Fri 8am–5pm',
    open: true,
    advisors: [
      {
        id: 'adv-1',
        name: 'Alex Whitfield',
        title: 'Financial Advisor',
        photoUrl: 'https://i.pravatar.cc/150?img=1',
        newClientStatus: 'accepting',
        focusAreas: [
          'Investors Nearing Retirement',
          'College Savers',
          'Early Life Stage Investors',
          'New Investors',
        ],
        designations: ['CFP®'],
        tenureYears: 2,
        linkedIn: true,
        facebook: true,
        personalInterests: ['golf', 'cycling'],
      },
    ],
    supportStaff: [
      {
        id: 'staff-1',
        name: 'Grace Bellamy',
        title: 'Branch Office Administrator',
      },
    ],
  },
  {
    id: 'loc-2',
    name: 'Clayton Central',
    address: '7701 Forsyth Blvd, Clayton, MO 63105',
    lat: 38.6459,
    lng: -90.3374,
    hours: 'Mon–Fri 8am–6pm, Sat 9am–1pm',
    open: true,
    advisors: [
      {
        id: 'adv-2',
        name: 'Jordan Delgado',
        title: 'Financial Advisor',
        photoUrl: 'https://i.pravatar.cc/150?img=2',
        newClientStatus: 'accepting',
        focusAreas: [
          'Charitable Giving',
          'Young Families',
          'Money Management Strategies',
        ],
        designations: ['CFA', 'CRPC®'],
        tenureYears: 6,
        linkedIn: true,
        facebook: false,
        personalInterests: ['gardening', 'travel', 'woodworking'],
        hours: {
          mon: { status: 'open', opens: '8am', closes: '6pm' },
          tue: { status: 'open', opens: '8am', closes: '6pm' },
          wed: { status: 'closed' },
          thu: { status: 'open', opens: '8am', closes: '6pm' },
          fri: { status: 'open', opens: '8am', closes: '6pm' },
          sat: { status: 'byAppointment' },
          sun: { status: 'closed' },
        },
      },
      {
        id: 'adv-3',
        name: 'Taylor Nair',
        title: 'Financial Advisor',
        photoUrl: 'https://i.pravatar.cc/150?img=3',
        newClientStatus: 'waitlist',
        focusAreas: [
          'Small Business Retirement Plans',
          'Women Investors',
          'Divorce Financial Planning',
          'Healthcare and Long-Term Care Planning',
          'Social Security Optimization',
        ],
        designations: ['ChFC®'],
        tenureYears: 10,
        linkedIn: true,
        facebook: false,
        personalInterests: [
          'photography',
          'wine tasting',
          'reading',
          'sailing',
        ],
        hours: {
          mon: { status: 'closed' },
          tue: { status: 'open', opens: '8am', closes: '6pm' },
          wed: { status: 'open', opens: '8am', closes: '6pm' },
          thu: { status: 'open', opens: '8am', closes: '6pm' },
          fri: { status: 'open', opens: '8am', closes: '6pm' },
          sat: { status: 'open', opens: '9am', closes: '1pm' },
          sun: { status: 'closed' },
        },
      },
    ],
    supportStaff: [
      {
        id: 'staff-2',
        name: 'Nathan Pruitt',
        title: 'Branch Office Administrator',
      },
      {
        id: 'staff-3',
        name: 'Priya Chandra',
        photoUrl: 'https://i.pravatar.cc/150?img=30',
        title: 'Branch Office Administrator',
      },
      {
        id: 'staff-4',
        name: 'Marcus Delaney',
        title: 'Senior Branch Office Administrator',
      },
    ],
  },
  {
    id: 'loc-3',
    name: 'Chesterfield Valley',
    address: '17330 N Outer Forty Rd, Chesterfield, MO 63005',
    lat: 38.6631,
    lng: -90.5771,
    hours: 'Mon–Fri 9am–5pm',
    open: false,
    advisors: [
      {
        id: 'adv-4',
        name: 'Morgan Bennett',
        title: 'Senior Financial Advisor',
        photoUrl: 'https://i.pravatar.cc/150?img=4',
        newClientStatus: 'referralOnly',
        focusAreas: [
          'Sudden Wealth Events',
          'Multigenerational Wealth Transfer',
        ],
        designations: ['CLU®', 'CPWA®', 'CFP®'],
        tenureYears: 21,
        linkedIn: true,
        facebook: true,
        personalInterests: ['distance running', 'fishing'],
        hours: {
          mon: { status: 'open', opens: '9am', closes: '5pm' },
          tue: { status: 'open', opens: '9am', closes: '5pm' },
          wed: { status: 'byAppointment' },
          thu: { status: 'open', opens: '9am', closes: '5pm' },
          fri: { status: 'closed' },
          sat: { status: 'closed' },
          sun: { status: 'closed' },
        },
      },
    ],
    supportStaff: [
      {
        id: 'staff-5',
        name: 'Isabel Ortega',
        title: 'Branch Office Administrator',
      },
    ],
  },
  {
    id: 'loc-4',
    name: 'Kirkwood Main Street',
    address: '111 W Argonne Dr, Kirkwood, MO 63122',
    lat: 38.5834,
    lng: -90.4068,
    hours: 'Mon–Fri 8am–5pm',
    open: true,
    advisors: [
      {
        id: 'adv-5',
        name: 'Casey Ashford',
        title: 'Financial Advisor',
        photoUrl: 'https://i.pravatar.cc/150?img=5',
        newClientStatus: 'accepting',
        focusAreas: [
          'Early Life Stage Investors',
          'New Investors',
          'Balancing Debt and Saving',
          'Charitable Giving',
          'Young Families',
          'Money Management Strategies',
        ],
        designations: ['CRPC®'],
        tenureYears: 5,
        linkedIn: false,
        facebook: false,
        personalInterests: ['woodworking', 'community theater', 'painting'],
      },
    ],
    supportStaff: [
      {
        id: 'staff-6',
        name: 'Trevor Nakamura',
        photoUrl: 'https://i.pravatar.cc/150?img=31',
        title: 'Branch Office Administrator',
      },
    ],
  },
  {
    id: 'loc-5',
    name: 'Webster Groves',
    address: '8 W Lockwood Ave, Webster Groves, MO 63119',
    lat: 38.5895,
    lng: -90.3568,
    hours: 'Mon–Fri 9am–5pm',
    open: true,
    advisors: [
      {
        id: 'adv-6',
        name: 'Riley Okafor',
        title: 'Financial Advisor',
        photoUrl: 'https://i.pravatar.cc/150?img=6',
        newClientStatus: 'accepting',
        focusAreas: [
          'Money Management Strategies',
          'Business Owners',
          'Tax-Efficient Investing',
        ],
        designations: ['RICP®', 'CPFA'],
        tenureYears: 9,
        linkedIn: true,
        facebook: false,
        personalInterests: [
          'reading',
          'sailing',
          'volunteering at the local food bank',
          'kayaking',
        ],
      },
    ],
    supportStaff: [
      {
        id: 'staff-7',
        name: 'Lucia Fernandez',
        title: 'Branch Office Administrator',
      },
    ],
  },
  {
    id: 'loc-6',
    name: 'Ballwin Plaza',
    address: '14855 Manchester Rd, Ballwin, MO 63011',
    lat: 38.5951,
    lng: -90.5462,
    hours: 'Mon–Fri 8am–5pm',
    open: true,
    advisors: [
      {
        id: 'adv-7',
        name: 'Avery Carrow',
        title: 'Financial Advisor',
        photoUrl: 'https://i.pravatar.cc/150?img=7',
        newClientStatus: 'waitlist',
        focusAreas: [
          'Divorce Financial Planning',
          'Healthcare and Long-Term Care Planning',
          'Social Security Optimization',
          'Sudden Wealth Events',
          'Multigenerational Wealth Transfer',
          'Military and Veterans',
          'Investors Nearing Retirement',
          'College Savers',
        ],
        designations: ['CPWA®'],
        tenureYears: 13,
        linkedIn: true,
        facebook: true,
        personalInterests: ['skiing', 'chess'],
        hours: {
          mon: { status: 'open', opens: '8am', closes: '5pm' },
          tue: { status: 'open', opens: '8am', closes: '5pm' },
          wed: { status: 'closed' },
          thu: { status: 'open', opens: '8am', closes: '5pm' },
          fri: { status: 'open', opens: '8am', closes: '5pm' },
          sat: { status: 'closed' },
          sun: { status: 'closed' },
        },
      },
    ],
    supportStaff: [
      {
        id: 'staff-8',
        name: 'Bennett Cole',
        title: 'Senior Branch Office Administrator',
      },
    ],
  },
  {
    id: 'loc-7',
    name: "O'Fallon Crossing",
    address: '1300 Highway K, O’Fallon, MO 63366',
    lat: 38.8106,
    lng: -90.6998,
    hours: 'Mon–Fri 9am–6pm',
    open: true,
    advisors: [
      {
        id: 'adv-8',
        name: 'Quinn Marsh',
        title: 'Financial Advisor',
        photoUrl: 'https://i.pravatar.cc/150?img=8',
        newClientStatus: 'accepting',
        focusAreas: [
          'Military and Veterans',
          'Investors Nearing Retirement',
          'College Savers',
          'Early Life Stage Investors',
        ],
        designations: ['AAMS™', 'CFA'],
        tenureYears: 4,
        linkedIn: true,
        facebook: false,
        personalInterests: ['painting', 'cooking', 'trivia nights'],
      },
    ],
    supportStaff: [
      {
        id: 'staff-9',
        name: 'Simone Alvarez',
        photoUrl: 'https://i.pravatar.cc/150?img=32',
        title: 'Branch Office Administrator',
      },
    ],
  },
  {
    id: 'loc-8',
    name: 'St. Charles Riverfront',
    address: '425 S Main St, St. Charles, MO 63301',
    lat: 38.7828,
    lng: -90.4877,
    hours: 'Mon–Fri 8am–5pm',
    open: true,
    advisors: [
      {
        id: 'adv-9',
        name: 'Rowan Ferrante',
        title: 'Financial Advisor',
        photoUrl: 'https://i.pravatar.cc/150?img=9',
        newClientStatus: 'accepting',
        focusAreas: [
          'Balancing Debt and Saving',
          'Charitable Giving',
          'Young Families',
          'Money Management Strategies',
          'Business Owners',
          'Tax-Efficient Investing',
          'Small Business Retirement Plans',
        ],
        designations: ['CPFA'],
        tenureYears: 8,
        linkedIn: true,
        facebook: false,
        personalInterests: [
          'volunteering at the local food bank',
          'kayaking',
          'golf',
          'cycling',
        ],
        hours: {
          mon: { status: 'open', opens: '8am', closes: '5pm' },
          tue: { status: 'open', opens: '8am', closes: '5pm' },
          wed: { status: 'open', opens: '8am', closes: '5pm' },
          thu: { status: 'open', opens: '8am', closes: '5pm' },
          fri: { status: 'byAppointment' },
          sat: { status: 'closed' },
          sun: { status: 'closed' },
        },
      },
      {
        id: 'adv-10',
        name: 'Skyler Castellano',
        title: 'Financial Advisor',
        photoUrl: 'https://i.pravatar.cc/150?img=10',
        newClientStatus: 'accepting',
        focusAreas: [
          'Tax-Efficient Investing',
          'Small Business Retirement Plans',
        ],
        designations: ['CFP®', 'CLU®'],
        tenureYears: 12,
        linkedIn: false,
        facebook: true,
        personalInterests: ['live music', 'hiking'],
        hours: {
          mon: { status: 'closed' },
          tue: { status: 'open', opens: '8am', closes: '5pm' },
          wed: { status: 'open', opens: '8am', closes: '5pm' },
          thu: { status: 'open', opens: '8am', closes: '5pm' },
          fri: { status: 'open', opens: '8am', closes: '5pm' },
          sat: { status: 'closed' },
          sun: { status: 'closed' },
        },
      },
    ],
    supportStaff: [
      {
        id: 'staff-10',
        name: 'Owen McAllister',
        title: 'Branch Office Administrator',
      },
      {
        id: 'staff-11',
        name: 'Renata Sokolova',
        title: 'Branch Office Administrator',
      },
    ],
  },
  {
    id: 'loc-9',
    name: 'Maplewood Commons',
    address: '7260 Manchester Rd, Maplewood, MO 63143',
    lat: 38.6134,
    lng: -90.3238,
    hours: 'Mon–Fri 9am–5pm',
    open: false,
    advisors: [
      {
        id: 'adv-11',
        name: 'Reese Ibarra',
        title: 'Financial Advisor',
        photoUrl: 'https://i.pravatar.cc/150?img=11',
        newClientStatus: 'referralOnly',
        focusAreas: [
          'Social Security Optimization',
          'Sudden Wealth Events',
          'Multigenerational Wealth Transfer',
        ],
        designations: ['CFA'],
        tenureYears: 3,
        linkedIn: true,
        facebook: false,
        personalInterests: [
          'trivia nights',
          'youth sports coaching',
          'photography',
        ],
      },
    ],
    supportStaff: [
      {
        id: 'staff-12',
        name: 'Julian Voss',
        photoUrl: 'https://i.pravatar.cc/150?img=33',
        title: 'Senior Branch Office Administrator',
      },
    ],
  },
  {
    id: 'loc-10',
    name: 'Florissant Square',
    address: '1050 Waterford Dr, Florissant, MO 63033',
    lat: 38.7892,
    lng: -90.3223,
    hours: 'Mon–Fri 8am–5pm',
    open: true,
    advisors: [
      {
        id: 'adv-12',
        name: 'Emerson Thackeray',
        title: 'Financial Advisor',
        photoUrl: 'https://i.pravatar.cc/150?img=12',
        newClientStatus: 'accepting',
        focusAreas: [
          'College Savers',
          'Early Life Stage Investors',
          'New Investors',
          'Balancing Debt and Saving',
          'Charitable Giving',
        ],
        designations: ['ChFC®', 'RICP®'],
        tenureYears: 7,
        linkedIn: true,
        facebook: false,
        personalInterests: ['golf', 'cycling', 'distance running', 'fishing'],
      },
    ],
    supportStaff: [
      {
        id: 'staff-13',
        name: 'Camille Duarte',
        title: 'Branch Office Administrator',
      },
    ],
  },
  {
    id: 'loc-11',
    name: 'University City',
    address: '6660 Delmar Blvd, University City, MO 63130',
    lat: 38.6581,
    lng: -90.3095,
    hours: 'Mon–Fri 9am–6pm',
    open: true,
    advisors: [
      {
        id: 'adv-13',
        name: 'Finley Rashid',
        title: 'Financial Advisor',
        photoUrl: 'https://i.pravatar.cc/150?img=13',
        newClientStatus: 'accepting',
        focusAreas: [
          'Young Families',
          'Money Management Strategies',
          'Business Owners',
          'Tax-Efficient Investing',
          'Small Business Retirement Plans',
          'Women Investors',
          'Divorce Financial Planning',
          'Healthcare and Long-Term Care Planning',
          'Social Security Optimization',
        ],
        designations: ['CLU®'],
        tenureYears: 11,
        linkedIn: true,
        facebook: true,
        personalInterests: ['gardening', 'travel'],
      },
    ],
    supportStaff: [
      {
        id: 'staff-14',
        name: 'Desmond Ryker',
        title: 'Branch Office Administrator',
      },
    ],
  },
  {
    id: 'loc-12',
    name: 'Manchester Corners',
    address: '14275 Manchester Rd, Manchester, MO 63011',
    lat: 38.5975,
    lng: -90.5087,
    hours: 'Mon–Fri 8am–5pm',
    open: true,
    advisors: [
      {
        id: 'adv-14',
        name: 'Hayden Lindqvist',
        title: 'Financial Advisor',
        photoUrl: 'https://i.pravatar.cc/150?img=14',
        newClientStatus: 'waitlist',
        focusAreas: [
          'Women Investors',
          'Divorce Financial Planning',
          'Healthcare and Long-Term Care Planning',
          'Social Security Optimization',
        ],
        designations: ['CRPC®', 'AAMS™'],
        tenureYears: 2,
        linkedIn: true,
        facebook: false,
        personalInterests: ['photography', 'wine tasting', 'reading'],
      },
    ],
    supportStaff: [
      {
        id: 'staff-15',
        name: 'Odessa Marlowe',
        photoUrl: 'https://i.pravatar.cc/150?img=34',
        title: 'Branch Office Administrator',
      },
    ],
  },
  {
    id: 'loc-13',
    name: 'Ferguson Heights',
    address: '1 N Florissant Rd, Ferguson, MO 63135',
    lat: 38.7442,
    lng: -90.3054,
    hours: 'Mon–Fri 9am–5pm',
    open: true,
    advisors: [
      {
        id: 'adv-15',
        name: 'Jamie Solheim',
        title: 'Financial Advisor',
        photoUrl: 'https://i.pravatar.cc/150?img=15',
        newClientStatus: 'accepting',
        focusAreas: [
          'Multigenerational Wealth Transfer',
          'Military and Veterans',
          'Investors Nearing Retirement',
          'College Savers',
          'Early Life Stage Investors',
          'New Investors',
        ],
        designations: ['RICP®'],
        tenureYears: 6,
        linkedIn: false,
        facebook: false,
        personalInterests: ['distance running', 'fishing', 'skiing', 'chess'],
      },
    ],
    supportStaff: [
      {
        id: 'staff-16',
        name: 'Theo Kavanagh',
        title: 'Senior Branch Office Administrator',
      },
    ],
  },
  {
    id: 'loc-14',
    name: 'Creve Coeur Lakeside',
    address: '11477 Olde Cabin Rd, Creve Coeur, MO 63141',
    lat: 38.6659,
    lng: -90.4437,
    hours: 'Mon–Fri 8am–6pm',
    open: true,
    advisors: [
      {
        id: 'adv-16',
        name: 'Kai Okonkwo',
        title: 'Senior Financial Advisor',
        photoUrl: 'https://i.pravatar.cc/150?img=16',
        newClientStatus: 'accepting',
        focusAreas: [
          'New Investors',
          'Balancing Debt and Saving',
          'Charitable Giving',
        ],
        designations: ['CPWA®', 'CFP®', 'CLU®'],
        tenureYears: 21,
        linkedIn: true,
        facebook: true,
        personalInterests: ['woodworking', 'community theater'],
        hours: {
          mon: { status: 'open', opens: '8am', closes: '6pm' },
          tue: { status: 'open', opens: '8am', closes: '6pm' },
          wed: { status: 'open', opens: '8am', closes: '6pm' },
          thu: { status: 'open', opens: '8am', closes: '6pm' },
          fri: { status: 'byAppointment' },
          sat: { status: 'closed' },
          sun: { status: 'closed' },
        },
      },
    ],
    supportStaff: [
      {
        id: 'staff-17',
        name: 'Wren Sutherland',
        title: 'Branch Office Administrator',
      },
    ],
  },
  {
    id: 'loc-15',
    name: 'Sunset Hills',
    address: '3853 S Lindbergh Blvd, Sunset Hills, MO 63127',
    lat: 38.5439,
    lng: -90.3898,
    hours: 'Mon–Fri 9am–5pm',
    open: false,
    advisors: [
      {
        id: 'adv-17',
        name: 'Logan Ashcombe',
        title: 'Financial Advisor',
        photoUrl: 'https://i.pravatar.cc/150?img=17',
        newClientStatus: 'referralOnly',
        focusAreas: [
          'Business Owners',
          'Tax-Efficient Investing',
          'Small Business Retirement Plans',
          'Women Investors',
          'Divorce Financial Planning',
          'Healthcare and Long-Term Care Planning',
          'Social Security Optimization',
        ],
        designations: ['AAMS™'],
        tenureYears: 14,
        linkedIn: true,
        facebook: false,
        personalInterests: [
          'reading',
          'sailing',
          'volunteering at the local food bank',
        ],
      },
    ],
    supportStaff: [
      {
        id: 'staff-18',
        name: 'Miles Corbett',
        photoUrl: 'https://i.pravatar.cc/150?img=35',
        title: 'Branch Office Administrator',
      },
    ],
  },
  {
    id: 'loc-16',
    name: 'Affton Village',
    address: '9800 Gravois Rd, Affton, MO 63123',
    lat: 38.5589,
    lng: -90.3298,
    hours: 'Mon–Fri 8am–5pm',
    open: true,
    advisors: [
      {
        id: 'adv-18',
        name: 'Parker Trent',
        title: 'Financial Advisor',
        photoUrl: 'https://i.pravatar.cc/150?img=18',
        newClientStatus: 'accepting',
        focusAreas: [
          'Healthcare and Long-Term Care Planning',
          'Social Security Optimization',
        ],
        designations: ['CPFA', 'ChFC®'],
        tenureYears: 5,
        linkedIn: true,
        facebook: false,
        personalInterests: ['skiing', 'chess', 'live music', 'hiking'],
      },
    ],
    supportStaff: [
      {
        id: 'staff-19',
        name: 'Ines Delacroix',
        title: 'Branch Office Administrator',
      },
    ],
  },
  {
    id: 'loc-17',
    name: 'Wentzville Trailhead',
    address: '1550 Wentzville Pkwy, Wentzville, MO 63385',
    lat: 38.8114,
    lng: -90.8529,
    hours: 'Mon–Fri 9am–6pm',
    open: true,
    advisors: [
      {
        id: 'adv-19',
        name: 'Louis Everhart',
        title: 'Financial Advisor',
        photoUrl: 'https://i.pravatar.cc/150?img=51',
        newClientStatus: 'accepting',
        focusAreas: [
          'Investors Nearing Retirement',
          'College Savers',
          'Early Life Stage Investors',
          'New Investors',
          'Balancing Debt and Saving',
        ],
        designations: ['CFP®'],
        tenureYears: 9,
        linkedIn: true,
        facebook: true,
        personalInterests: ['painting', 'cooking'],
      },
    ],
    supportStaff: [
      {
        id: 'staff-20',
        name: 'Soren Whitlock',
        title: 'Senior Branch Office Administrator',
      },
    ],
  },
  {
    id: 'loc-18',
    name: 'Arnold Riverside',
    address: '2100 Arnold Tenbrook Rd, Arnold, MO 63010',
    lat: 38.4342,
    lng: -90.3765,
    hours: 'Mon–Fri 8am–5pm',
    open: true,
    advisors: [
      {
        id: 'adv-20',
        name: 'Charlie Faulkner',
        title: 'Financial Advisor',
        photoUrl: 'https://i.pravatar.cc/150?img=20',
        newClientStatus: 'waitlist',
        focusAreas: [
          'Charitable Giving',
          'Young Families',
          'Money Management Strategies',
          'Business Owners',
          'Tax-Efficient Investing',
          'Small Business Retirement Plans',
          'Women Investors',
          'Divorce Financial Planning',
        ],
        designations: ['CFA', 'CRPC®'],
        tenureYears: 13,
        linkedIn: false,
        facebook: false,
        personalInterests: [
          'volunteering at the local food bank',
          'kayaking',
          'golf',
        ],
      },
    ],
    supportStaff: [
      {
        id: 'staff-21',
        name: 'Dahlia Renner',
        photoUrl: 'https://i.pravatar.cc/150?img=36',
        title: 'Branch Office Administrator',
      },
    ],
  },
  {
    id: 'loc-19',
    name: 'Fenton Corporate Park',
    address: '1050 Gravois Bluffs Blvd, Fenton, MO 63026',
    lat: 38.5136,
    lng: -90.4437,
    hours: 'Mon–Fri 9am–5pm',
    open: true,
    advisors: [
      {
        id: 'adv-21',
        name: 'Drew Vasquez',
        title: 'Financial Advisor',
        photoUrl: 'https://i.pravatar.cc/150?img=21',
        newClientStatus: 'accepting',
        focusAreas: [
          'Small Business Retirement Plans',
          'Women Investors',
          'Divorce Financial Planning',
          'Healthcare and Long-Term Care Planning',
        ],
        designations: ['ChFC®'],
        tenureYears: 4,
        linkedIn: true,
        facebook: false,
        personalInterests: ['live music', 'hiking', 'gardening', 'travel'],
      },
    ],
    supportStaff: [
      {
        id: 'staff-22',
        name: 'Cassius Pemberton',
        title: 'Branch Office Administrator',
      },
    ],
  },
  {
    id: 'loc-20',
    name: 'Bridgeton Gateway',
    address: '3630 Pennridge Dr, Bridgeton, MO 63044',
    lat: 38.7684,
    lng: -90.4048,
    hours: 'Mon–Fri 8am–5pm',
    open: true,
    advisors: [
      {
        id: 'adv-22',
        name: 'Elliot Loomis',
        title: 'Financial Advisor',
        photoUrl: 'https://i.pravatar.cc/150?img=22',
        newClientStatus: 'accepting',
        focusAreas: [
          'Sudden Wealth Events',
          'Multigenerational Wealth Transfer',
          'Military and Veterans',
        ],
        designations: ['CLU®', 'CPWA®'],
        tenureYears: 8,
        linkedIn: true,
        facebook: true,
        personalInterests: ['trivia nights', 'youth sports coaching'],
      },
    ],
    supportStaff: [
      {
        id: 'staff-23',
        name: 'Junie Halvorsen',
        title: 'Branch Office Administrator',
      },
    ],
  },
];
