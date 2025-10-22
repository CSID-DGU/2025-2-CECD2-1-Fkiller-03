import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { mockApi } from "@/lib/mockApi";
import { Ticket, User } from "@/types";
import { Header } from "@/components/Header";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserCog, Clock, TrendingUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [managers, setManagers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedManager, setSelectedManager] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ticketsData, managersData] = await Promise.all([
        mockApi.getTickets(user!.email, user!.role),
        mockApi.getManagers(),
      ]);
      setTickets(ticketsData);
      setManagers(managersData);
    } catch (error) {
      toast.error("데이터를 불러오는데 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignTicket = async () => {
    if (!selectedTicket || !selectedManager) return;

    try {
      await mockApi.assignTicket(selectedTicket.id, selectedManager);
      toast.success("티켓이 성공적으로 재할당되었습니다");
      setIsDialogOpen(false);
      setSelectedTicket(null);
      setSelectedManager("");
      loadData();
    } catch (error) {
      toast.error("티켓 재할당에 실패했습니다");
    }
  };

  const openAssignDialog = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setSelectedManager(ticket.assignedTo || "");
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStats = () => {
    const total = tickets.length;
    const notStarted = tickets.filter((t) => t.status === "NOT_STARTED").length;
    const inProgress = tickets.filter((t) => t.status === "IN_PROGRESS").length;
    const done = tickets.filter((t) => t.status === "DONE").length;

    return { total, notStarted, inProgress, done };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">관리자 대시보드</h1>
          <p className="text-muted-foreground">모든 티켓과 할당을 관리하세요</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8 animate-fade-in">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">전체 티켓</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">시작 전</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.notStarted}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">진행 중</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">완료</CardTitle>
              <Clock className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.done}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tickets Table */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>전체 티켓</CardTitle>
            <CardDescription>티켓 할당을 확인하고 관리하세요</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>제목</TableHead>
                      <TableHead>카테고리</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>생성자</TableHead>
                      <TableHead>담당자</TableHead>
                      <TableHead>생성일</TableHead>
                      <TableHead className="text-right">작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          티켓이 없습니다
                        </TableCell>
                      </TableRow>
                    ) : (
                      tickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-medium">#{ticket.id}</TableCell>
                          <TableCell className="max-w-[200px]">
                            <div className="line-clamp-1 font-medium">{ticket.title}</div>
                            <div className="line-clamp-1 text-xs text-muted-foreground">{ticket.description}</div>
                          </TableCell>
                          <TableCell>
                            {ticket.category && (
                              <span className="text-xs bg-muted px-2 py-1 rounded">{ticket.category}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={ticket.status} />
                          </TableCell>
                          <TableCell className="text-sm">{ticket.createdBy.split("@")[0]}</TableCell>
                          <TableCell className="text-sm">
                            {ticket.assignedTo ? ticket.assignedTo.split("@")[0] : "-"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(ticket.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openAssignDialog(ticket)}
                            >
                              <UserCog className="h-4 w-4 mr-1" />
                              할당
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assign Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-popover">
            <DialogHeader>
              <DialogTitle>티켓 할당</DialogTitle>
              <DialogDescription>
                처리를 위해 이 티켓을 매니저에게 할당하세요
              </DialogDescription>
            </DialogHeader>
            {selectedTicket && (
              <div className="space-y-4 mt-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="font-medium mb-1">{selectedTicket.title}</p>
                  <p className="text-sm text-muted-foreground">Ticket #{selectedTicket.id}</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="manager">매니저 선택</Label>
                  <Select value={selectedManager} onValueChange={setSelectedManager}>
                    <SelectTrigger id="manager">
                      <SelectValue placeholder="매니저를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {managers.map((manager) => (
                        <SelectItem key={manager.id} value={manager.email}>
                          {manager.name} ({manager.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    취소
                  </Button>
                  <Button onClick={handleAssignTicket} disabled={!selectedManager}>
                    티켓 할당
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
