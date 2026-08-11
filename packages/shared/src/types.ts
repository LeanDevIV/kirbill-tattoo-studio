export interface User {
  _id: string;
  username: string;
}

export interface HeroImage {
  _id: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryImage {
  _id: string;
  imageUrl: string;
  title: string;
  category: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const APPOINTMENT_STATUS = ["pending", "confirmed", "cancelled", "completed"] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUS)[number];

export interface Appointment {
  _id: string;
  clientEmail: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  amount: number;
  description: string;
  conversationId?: string;
  createdAt: string;
  updatedAt: string;
}

export const PAYMENT_STATUS = ["pending", "paid", "cancelled", "refunded"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUS)[number];

export interface Payment {
  _id: string;
  appointmentId?: string;
  clientEmail: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export const CONVERSATION_STATUS = ["active", "closed"] as const;
export type ConversationStatus = (typeof CONVERSATION_STATUS)[number];

export interface Conversation {
  _id: string;
  clientEmail: string;
  clientName: string;
  status: ConversationStatus;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

export const MESSAGE_SENDER = ["client", "admin"] as const;
export type MessageSender = (typeof MESSAGE_SENDER)[number];

export interface Message {
  _id: string;
  conversationId: string;
  sender: MessageSender;
  text: string;
  imageUrl?: string;
  timestamp: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface ChatInitPayload {
  email: string;
  name: string;
}

export interface ChatMessagePayload {
  conversationId: string;
  text: string;
  imageUrl?: string;
}

export type WsMessageType =
  | "init"
  | "message"
  | "appointment_created"
  | "appointment_updated"
  | "appointment_cancelled";

export interface WsMessage {
  type: WsMessageType;
  payload: Record<string, unknown>;
}
