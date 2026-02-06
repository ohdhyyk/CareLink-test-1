export interface Profile {
  id: string;
  username: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface Connection {
  id: string;
  user_id: string;
  partner_id: string;
  created_at: string;
}

export interface Wish {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_completed: boolean;
  created_at: string;
}

export type ViewState = 'LANDING' | 'AUTH' | 'ONBOARDING' | 'CONNECT' | 'DASHBOARD' | 'ADMIN_LOGIN' | 'ADMIN_DASHBOARD';