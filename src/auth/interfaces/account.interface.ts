export interface Account {
  id: number;
  full_name: string;
  email?: string;
  phone_number?: string;
  password: string;
  role: 'user' | 'contractor';
  is_verified: boolean;
}
