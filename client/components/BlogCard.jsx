import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit3, Trash2, Calendar, User, MoreVertical, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate, truncateText } from "@/lib/utils";

export default function BlogCard({ post, onEdit, onDelete, onView }) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card className="group overflow-hidden card-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
      {/* Image */}
      <div className="relative overflow-hidden bg-muted">
        {post.imageUrl && !imageError ? (
          <img
            src={post.imageUrl}
            alt={post.title}
            onError={handleImageError}
            className="w-full h-52 object-cover transition-all duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-52 bg-gradient-to-br from-blue-100/80 via-purple-100/60 to-pink-100/40 dark:from-blue-950/50 dark:via-purple-950/30 dark:to-pink-950/20 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Eye className="w-10 h-10 mx-auto mb-3 opacity-60" />
              <p className="text-sm font-medium">No image</p>
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Actions Dropdown - Mobile/Tablet */}
        <div className="absolute top-3 right-3 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="w-8 h-8 p-0 bg-background/80 backdrop-blur-sm"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onView(post)} className="gap-2">
                <Eye className="w-4 h-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(post)} className="gap-2">
                <Edit3 className="w-4 h-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(post.id)}
                className="gap-2 text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <CardHeader className="pb-4 pt-6">
        <h3 className="text-xl font-bold line-clamp-2 leading-tight group-hover:gradient-text transition-all duration-300">
          {post.title}
        </h3>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            <span className="font-medium">{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-6">
        <p className="text-muted-foreground leading-relaxed line-clamp-3">
          {truncateText(post.content, 140)}
        </p>
      </CardContent>

      {/* Desktop Actions */}
      <CardFooter className="pt-0 gap-3 hidden md:flex">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(post)}
          className="flex-1 gap-2 rounded-xl border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
        >
          <Eye className="w-4 h-4" />
          Read More
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(post)}
          className="gap-2 rounded-xl hover:bg-accent/80 transition-all duration-300"
        >
          <Edit3 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(post.id)}
          className="gap-2 text-destructive hover:text-destructive rounded-xl hover:bg-destructive/10 transition-all duration-300"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardFooter>

      {/* Mobile Actions */}
      <CardFooter className="pt-0 md:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(post)}
          className="w-full gap-2 rounded-xl border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
        >
          <Eye className="w-4 h-4" />
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
}
