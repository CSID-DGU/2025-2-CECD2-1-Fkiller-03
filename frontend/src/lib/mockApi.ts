import { User, Ticket, LoginCredentials, AuthResponse, TicketStatus } from '@/types';

// Mock database
const users: User[] = [
  { id: 1, name: '김사용자', email: 'user@example.com', role: 'user' },
  { id: 2, name: '이매니저', email: 'manager@example.com', role: 'manager' },
  { id: 3, name: '박관리자', email: 'admin@example.com', role: 'admin' },
];

let tickets: Ticket[] = [
  {
    id: 1,
    title: '모바일 로그인 문제',
    description: '모바일 디바이스에서 로그인 시 500 에러가 발생합니다',
    status: 'IN_PROGRESS',
    category: '인증',
    createdBy: 'user@example.com',
    assignedTo: 'manager@example.com',
    createdAt: '2025-10-14T10:00:00',
  },
  {
    id: 2,
    title: '결제 게이트웨이 오류',
    description: '결제 진행 시 체크아웃에서 실패합니다',
    status: 'NOT_STARTED',
    category: '결제',
    createdBy: 'user@example.com',
    assignedTo: 'manager@example.com',
    createdAt: '2025-10-14T09:30:00',
  },
  {
    id: 3,
    title: '대시보드 성능 문제',
    description: '대량의 데이터가 있을 때 대시보드 로딩이 느립니다',
    status: 'DONE',
    category: '성능',
    createdBy: 'user@example.com',
    assignedTo: 'manager@example.com',
    createdAt: '2025-10-13T14:00:00',
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  // Authentication
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(500);
    
    const user = users.find((u) => u.email === credentials.email);
    
    if (!user || credentials.password !== '1234') {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다');
    }

    return {
      token: `mock-token-${user.id}`,
      user,
    };
  },

  async getCurrentUser(token: string): Promise<User> {
    await delay(300);
    
    const userId = parseInt(token.split('-')[2]);
    const user = users.find((u) => u.id === userId);
    
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다');
    }

    return user;
  },

  // Tickets
  async getTickets(userEmail: string, role: string): Promise<Ticket[]> {
    await delay(500);
    
    if (role === 'user') {
      return tickets.filter((t) => t.createdBy === userEmail);
    } else if (role === 'manager') {
      return tickets.filter((t) => t.assignedTo === userEmail);
    } else if (role === 'admin') {
      return tickets;
    }

    return [];
  },

  async createTicket(data: Omit<Ticket, 'id' | 'status' | 'createdAt'>): Promise<Ticket> {
    await delay(500);
    
    const newTicket: Ticket = {
      ...data,
      id: Math.max(...tickets.map((t) => t.id), 0) + 1,
      status: 'NOT_STARTED',
      createdAt: new Date().toISOString(),
    };

    tickets.push(newTicket);
    return newTicket;
  },

  async updateTicketStatus(ticketId: number, status: TicketStatus): Promise<Ticket> {
    await delay(500);
    
    const ticket = tickets.find((t) => t.id === ticketId);
    
    if (!ticket) {
      throw new Error('티켓을 찾을 수 없습니다');
    }

    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();
    
    return ticket;
  },

  async assignTicket(ticketId: number, managerEmail: string): Promise<Ticket> {
    await delay(500);
    
    const ticket = tickets.find((t) => t.id === ticketId);
    
    if (!ticket) {
      throw new Error('티켓을 찾을 수 없습니다');
    }

    ticket.assignedTo = managerEmail;
    ticket.updatedAt = new Date().toISOString();
    
    return ticket;
  },

  async getManagers(): Promise<User[]> {
    await delay(300);
    return users.filter((u) => u.role === 'manager');
  },
};
