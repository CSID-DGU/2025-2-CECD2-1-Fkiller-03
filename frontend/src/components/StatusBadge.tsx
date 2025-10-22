import { TicketStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Circle, Clock, CheckCircle2, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: TicketStatus;
}

const statusConfig = {
  NOT_STARTED: {
    label: "시작 전",
    variant: "secondary" as const,
    icon: Circle,
  },
  IN_PROGRESS: {
    label: "진행 중",
    variant: "default" as const,
    icon: Clock,
  },
  DONE: {
    label: "완료",
    variant: "success" as const,
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "거부됨",
    variant: "destructive" as const,
    icon: XCircle,
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1.5">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
