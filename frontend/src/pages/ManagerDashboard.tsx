import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { mockApi } from "@/lib/mockApi";
import { Ticket, TicketStatus } from "@/types";
import { Header } from "@/components/Header";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Clock, CheckCircle2, XCircle, Circle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ManagerDashboard() {
  const { user } = useAuthStore();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const data = await mockApi.getTickets(user!.email, user!.role);
      setTickets(data);
    } catch (error) {
      toast.error("티켓을 불러오는데 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (ticketId: number, newStatus: TicketStatus) => {
    try {
      await mockApi.updateTicketStatus(ticketId, newStatus);
      toast.success("티켓 상태가 업데이트되었습니다");
      loadTickets();
    } catch (error) {
      toast.error("상태 업데이트에 실패했습니다");
    }
  };

  const getTicketsByStatus = (status: TicketStatus) => {
    return tickets.filter((t) => t.status === status);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const statusColumns: { status: TicketStatus; label: string; icon: any; color: string }[] = [
    { status: "NOT_STARTED", label: "시작 전", icon: Circle, color: "text-muted-foreground" },
    { status: "IN_PROGRESS", label: "진행 중", icon: Clock, color: "text-primary" },
    { status: "DONE", label: "완료", icon: CheckCircle2, color: "text-success" },
    { status: "REJECTED", label: "거부됨", icon: XCircle, color: "text-destructive" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">내 작업</h1>
          <p className="text-muted-foreground">칸반 뷰로 할당된 티켓을 관리하세요</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-12 bg-muted rounded animate-pulse"></div>
                <div className="h-32 bg-muted rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
            {statusColumns.map((column) => {
              const columnTickets = getTicketsByStatus(column.status);
              const Icon = column.icon;

              return (
                <div key={column.status} className="flex flex-col">
                  <div className="mb-4 p-3 rounded-lg bg-card border border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${column.color}`} />
                        <h2 className="font-semibold">{column.label}</h2>
                      </div>
                      <span className="text-sm text-muted-foreground">{columnTickets.length}</span>
                    </div>
                  </div>

                  <div className="space-y-3 flex-1">
                    {columnTickets.map((ticket) => (
                      <Card key={ticket.id} className="hover:shadow-md transition-all">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base line-clamp-2">{ticket.title}</CardTitle>
                          {ticket.category && (
                            <CardDescription className="text-xs">{ticket.category}</CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {ticket.description}
                          </p>
                          
                          <div className="pt-2 border-t border-border/50">
                            <Select
                              value={ticket.status}
                              onValueChange={(value) => handleStatusChange(ticket.id, value as TicketStatus)}
                            >
                              <SelectTrigger className="w-full h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-popover">
                                <SelectItem value="NOT_STARTED">시작 전</SelectItem>
                                <SelectItem value="IN_PROGRESS">진행 중</SelectItem>
                                <SelectItem value="DONE">완료</SelectItem>
                                <SelectItem value="REJECTED">거부됨</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(ticket.createdAt)}
                            </span>
                            <span className="truncate max-w-[100px]">
                              {ticket.createdBy.split("@")[0]}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {columnTickets.length === 0 && (
                      <div className="p-4 text-center text-sm text-muted-foreground bg-muted/30 rounded-lg border-2 border-dashed border-border">
                        티켓 없음
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
