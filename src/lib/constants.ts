import { Category, UserName } from './types';

export const USERS: UserName[] = ['Chad', 'Steve'];

export const CATEGORIES: Category[] = ['sites', 'restaurants', 'events', 'experiences'];

export const DEPARTURE_DATE = new Date('2026-08-15T00:00:00+01:00');

export const CATEGORY_LABELS: Record<Category, Record<string, string>> = {
  sites: {
    portugal: 'Sites',
    merica: 'Sites',
  },
  restaurants: {
    portugal: 'Restaurants & Bars',
    merica: 'Restaurants',
  },
  events: {
    portugal: 'Events',
    merica: 'Events',
  },
  experiences: {
    portugal: 'Experiences',
    merica: 'Experiences',
  },
};

export const MERICA_SUBTITLES: Record<Category, string> = {
  sites: "Things you can't see from a Costco parking lot",
  restaurants: "Meals that aren't from a drive-through",
  events: 'Experiences not available at your local fairgrounds',
  experiences: "Adventures your HOA wouldn't approve of",
};

export const SNARK_BANNERS = [
  'Only X days until unlimited Olive Garden breadsticks',
  'Countdown to your first HOA violation letter',
  "Strip malls and parking lots await your return",
  "Soon you'll need a lifted truck just to see over traffic",
  'McMansion living: where every house looks the same but bigger',
  "Get ready for drive-throughs as a lifestyle choice",
  'Your future commute: 45 minutes to go 3 miles',
  "Back to a country where healthcare is an 'adventure'",
  "Time to relearn Fahrenheit like a real patriot",
  'Prepare for the land of 47 streaming subscriptions',
  "Welcome back to where 'walking distance' means driving",
  'Soon: explaining metric to confused cashiers again',
  "Get ready for portions that could feed a Portuguese family of 6",
  'Back to tipping math anxiety at every meal',
  "Returning to the land of the free (except parking, that's $30)",
  "America: where you need a car to get to your other car",
  'Prepare for mandatory small talk with every stranger',
  'Coming soon: inexplicable ranch dressing on everything',
];

export const SEED_ITEMS: Array<{
  category: Category;
  title: string;
  note: string | null;
  added_by: UserName;
  initials: string;
}> = [
  { category: 'sites', title: 'Fernando Pessoa Museum', note: null, added_by: 'Chad', initials: 'CS' },
  { category: 'sites', title: 'Gulbenkian Museum', note: null, added_by: 'Chad', initials: 'CS' },
  { category: 'sites', title: 'Roman artifacts in Alfama', note: null, added_by: 'Chad', initials: 'CS' },
  { category: 'sites', title: 'Ajuda Palace', note: null, added_by: 'Chad', initials: 'CS' },
  { category: 'sites', title: 'MAAT', note: null, added_by: 'Chad', initials: 'CS' },
  { category: 'sites', title: 'Coaches Museum', note: null, added_by: 'Chad', initials: 'CS' },
  { category: 'sites', title: 'Bugio Lighthouse', note: null, added_by: 'Chad', initials: 'CS' },
  { category: 'sites', title: 'St. António Church and Museum', note: null, added_by: 'Chad', initials: 'CS' },
  { category: 'sites', title: 'Carcavelos wine tasting', note: null, added_by: 'Chad', initials: 'CS' },
  { category: 'sites', title: 'Marquês de Pombal Palace', note: null, added_by: 'Chad', initials: 'CS' },
  { category: 'restaurants', title: 'Brunch at Santa Joana', note: null, added_by: 'Chad', initials: 'CS' },
  { category: 'restaurants', title: 'Lunch in Évora', note: null, added_by: 'Chad', initials: 'CS' },
  { category: 'restaurants', title: 'Lunch in Setúbal', note: null, added_by: 'Chad', initials: 'CS' },
  { category: 'events', title: 'Ana Moura concert', note: null, added_by: 'Chad', initials: 'CS' },
  { category: 'experiences', title: 'Metro photography day (station art)', note: null, added_by: 'Chad', initials: 'CS' },
  { category: 'experiences', title: 'Ferry to Seixal', note: null, added_by: 'Chad', initials: 'CS' },
  { category: 'experiences', title: 'Learn the Portuguese bread styles by name', note: null, added_by: 'Chad', initials: 'CS' },
  { category: 'experiences', title: 'Grill fish from the mercado', note: null, added_by: 'Chad', initials: 'CS' },
];
