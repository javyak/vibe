export type User = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  created_at?: string;
  last_login?: string;
};