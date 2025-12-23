export interface TempAccount {
  temp_token: string;
  full_name: string;
  phone_number: string;
  role: 'user' | 'contractor';
  otp: string;
  is_verified: boolean;
}