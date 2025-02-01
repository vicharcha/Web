export interface User {
  id: number;
  phone_number: string;
  name: string | null;
  verification_status: 'unverified' | 'pending' | 'verified';
  is_premium: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Message {
  id: number;
  sender_id: number;
  recipient_id: number;
  content: string;
  media_url: string | null;
  media_type: string | null;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  created_at: Date;
  updated_at: Date;
}

export interface Chat {
  id: number;
  name: string | null;
  is_group: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ChatParticipant {
  chat_id: number;
  user_id: number;
  is_admin: boolean;
  joined_at: Date;
}

export interface ChatMessage {
  id: number;
  chat_id: number;
  sender_id: number;
  content: string;
  media_url: string | null;
  media_type: string | null;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  created_at: Date;
  updated_at: Date;
}

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  content: string;
  is_read: boolean;
  created_at: Date;
}

export interface EmergencyContact {
  id: number;
  user_id: number;
  name: string;
  phone_number: string;
  relationship: string | null;
  created_at: Date;
  updated_at: Date;
}
