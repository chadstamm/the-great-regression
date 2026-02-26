import { Category } from './types';

export const CATEGORIES: Category[] = ['sites', 'restaurants', 'events', 'experiences'];

export const DEPARTURE_DATE = new Date('2026-08-01T00:00:00+01:00');

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
  added_by: string;
  icon: string;
}> = [
  { category: 'sites', title: 'Fernando Pessoa Museum', note: null, added_by: 'Chad', icon: 'caravel' },
  { category: 'sites', title: 'Gulbenkian Museum', note: null, added_by: 'Chad', icon: 'caravel' },
  { category: 'sites', title: 'Roman artifacts in Alfama', note: null, added_by: 'Chad', icon: 'caravel' },
  { category: 'sites', title: 'Ajuda Palace', note: null, added_by: 'Chad', icon: 'caravel' },
  { category: 'sites', title: 'MAAT', note: null, added_by: 'Chad', icon: 'caravel' },
  { category: 'sites', title: 'Coaches Museum', note: null, added_by: 'Chad', icon: 'caravel' },
  { category: 'sites', title: 'Bugio Lighthouse', note: null, added_by: 'Chad', icon: 'caravel' },
  { category: 'sites', title: 'St. Antonio Church and Museum', note: null, added_by: 'Chad', icon: 'caravel' },
  { category: 'experiences', title: 'Carcavelos wine tasting', note: null, added_by: 'Chad', icon: 'caravel' },
  { category: 'sites', title: 'Marques de Pombal Palace', note: null, added_by: 'Chad', icon: 'caravel' },
  { category: 'restaurants', title: 'Brunch at Santa Joana', note: null, added_by: 'Chad', icon: 'caravel' },
  { category: 'restaurants', title: 'Lunch in Evora', note: null, added_by: 'Chad', icon: 'caravel' },
  { category: 'restaurants', title: 'Lunch in Setubal', note: null, added_by: 'Chad', icon: 'caravel' },
  { category: 'events', title: 'Ana Moura concert', note: null, added_by: 'Chad', icon: 'caravel' },
  { category: 'experiences', title: 'Metro photography day (station art)', note: null, added_by: 'Chad', icon: 'caravel' },
  { category: 'experiences', title: 'Ferry to Seixal', note: null, added_by: 'Chad', icon: 'caravel' },
  { category: 'experiences', title: 'Learn the Portuguese bread styles by name', note: null, added_by: 'Chad', icon: 'caravel' },
  { category: 'experiences', title: 'Grill fish from the mercado', note: null, added_by: 'Chad', icon: 'caravel' },
];

export const USER_ICONS = [
  { id: 'caravel', label: 'Caravel', file: 'caravel.jpg' },
  { id: 'armillary', label: 'Armillary Sphere', file: 'armillary.jpg' },
  { id: 'tram', label: 'Tram 28', file: 'tram.jpg' },
  { id: 'sardine', label: 'Sardine', file: 'sardine.jpg' },
  { id: 'rooster', label: 'Galo de Barcelos', file: 'rooster.jpg' },
  { id: 'guitar', label: 'Portuguese Guitar', file: 'guitar.jpg' },
  { id: 'heart', label: 'Coracao de Viana', file: 'heart.jpg' },
  { id: 'cross', label: 'Cross of Christ', file: 'cross.jpg' },
] as const;

export type UserIconId = typeof USER_ICONS[number]['id'];
