export type AppMode = 'portugal' | 'merica' | 'uk';

export type UserName = 'Chad' | 'Steve';

export type Category = 'sites' | 'restaurants' | 'events' | 'experiences';

export type FilterStatus = 'all' | 'agreed' | 'done';

export interface BucketItem {
  id: string;
  category: Category;
  title: string;
  note: string | null;
  added_by: UserName;
  votes: string[];
  is_done: boolean;
  created_at: string;
}
