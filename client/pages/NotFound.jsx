import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, BookOpen } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        {/* 404 Icon */}
        <div className="space-y-4">
          <div className="text-8xl font-bold text-muted-foreground/20">404</div>
          <BookOpen className="w-16 h-16 mx-auto text-muted-foreground" />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Page Not Found</h1>
          <p className="text-muted-foreground leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been
            moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button onClick={() => navigate("/")} className="gap-2">
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
