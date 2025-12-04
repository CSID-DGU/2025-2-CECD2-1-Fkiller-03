import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { mockApi } from "@/lib/mockApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { LogIn, Workflow } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await mockApi.login({ email, password });
      setAuth(response.user, response.token);

      toast.success("로그인 성공!");

      // Route based on role
      if (response.user.role === "admin") {
        navigate("/admin");
      } else if (response.user.role === "manager") {
        navigate("/manager");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "로그인 실패");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-hero shadow-glow mb-4">
            <Workflow className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">ITOMS</h1>
          <p className="text-muted-foreground">Modern ITSM Service</p>
        </div>

        <Card className="shadow-lg border-border/50 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">환영합니다</CardTitle>
            <CardDescription>
              워크스페이스에 접속하려면 로그인하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  "로그인 중..."
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    로그인
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border/50">
              <p className="text-sm text-muted-foreground text-center mb-3">
                데모 계정:
              </p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between p-2 rounded bg-muted/50">
                  <span className="font-medium">일반 사용자:</span>
                  <span>user@example.com</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-muted/50">
                  <span className="font-medium">매니저:</span>
                  <span>manager@example.com</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-muted/50">
                  <span className="font-medium">관리자:</span>
                  <span>admin@example.com</span>
                </div>
                <p className="text-center pt-2">
                  비밀번호: <span className="font-mono">1234</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
