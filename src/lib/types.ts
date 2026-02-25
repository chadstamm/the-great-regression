export type AppMode = 'portugal' | 'merica';

export type Category = 'sites' | 'restaurants' | 'events' | 'experiences';

export type FilterStatus = 'all' | 'done';

export interface UserProfile {
  id: string;
  name: string;
  icon: string;
  created_at: string;
}

export interface BucketItem {
  id: string;
  category: Category;
  title: string;
  note: string | null;
  added_by: string;
  icon: string;
  votes: string[];
  is_done: boolean;
  completed_at: string | null;
  created_at: string;
}
