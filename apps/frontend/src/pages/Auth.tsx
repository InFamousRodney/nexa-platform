
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Github, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (authMode === "login") {
        // Mock login - would call Supabase auth in a real app
        console.log("Logging in with:", { email, password });
        toast({
          title: "Login successful",
          description: "Welcome back to NEXA!",
        });
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else if (authMode === "register") {
        if (password !== confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        // Mock registration - would call Supabase auth in a real app
        console.log("Registering with:", { email, password });
        toast({
          title: "Registration successful",
          description: "Welcome to NEXA! Please check your email to confirm your account.",
        });
        setTimeout(() => {
          setAuthMode("login");
          setIsLoading(false);
        }, 1000);
      } else if (authMode === "reset") {
        // Mock password reset - would call Supabase auth in a real app
        console.log("Resetting password for:", email);
        toast({
          title: "Reset instructions sent",
          description: "Please check your email for password reset instructions.",
        });
        setTimeout(() => {
          setAuthMode("login");
          setIsLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description: "An error occurred during authentication. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            NEXA
          </h1>
          <p className="text-muted-foreground mt-2">Salesforce metadata analysis platform</p>
        </div>

        {authMode === "reset" ? (
          <Card>
            <CardHeader>
              <CardTitle>Wachtwoord Herstellen</CardTitle>
              <CardDescription>
                Voer je e-mailadres in om herstel instructies te ontvangen
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mailadres</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="voorbeeld@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Bezig..." : "Verstuur Herstel Instructies"}
                </Button>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className="w-full"
                >
                  Terug naar Login
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <Tabs defaultValue="login" value={authMode} onValueChange={(v) => setAuthMode(v as "login" | "register")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Registreren</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mailadres</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="voorbeeld@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password">Wachtwoord</Label>
                    {authMode === "login" && (
                      <button
                        type="button"
                        className="text-xs text-primary hover:underline"
                        onClick={() => setAuthMode("reset")}
                      >
                        Wachtwoord vergeten?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                {authMode === "register" && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Bevestig Wachtwoord</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading
                    ? "Bezig..."
                    : authMode === "login"
                    ? "Login"
                    : "Registreer"}
                </Button>
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">of</span>
                  </div>
                </div>
                <Button variant="outline" type="button" className="w-full">
                  <Github className="mr-2 h-4 w-4" /> Login met GitHub
                </Button>
                <Button variant="outline" type="button" className="w-full">
                  <Mail className="mr-2 h-4 w-4" /> Login met Google
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
