export type UserRole = "user" | "manager" | "admin";

export type TicketStatus = "NOT_STARTED" | "IN_PROGRESS" | "DONE" | "REJECTED";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  category?: string;
  createdBy: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
