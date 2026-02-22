export type AppMode = 'portugal' | 'merica';

export type UserName = 'Chad' | 'Steve';

export type Category = 'sites' | 'restaurants' | 'events' | 'experiences';

export type FilterStatus = 'all' | 'done';

export interface BucketItem {
  id: string;
  category: Category;
  title: string;
  note: string | null;
  added_by: UserName;
  initials: string;
  votes: string[];
  is_done: boolean;
  created_at: string;
}
