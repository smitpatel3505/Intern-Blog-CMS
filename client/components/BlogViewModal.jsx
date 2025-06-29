import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit3, Trash2, Calendar, User, X, ImageIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function BlogViewModal({
  isOpen,
  onClose,
  post,
  onEdit,
  onDelete,
}) {
  const [imageError, setImageError] = useState(false);

  if (!post) return null;

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-6">
              <DialogTitle className="text-2xl font-bold leading-tight mb-3">
                {post.title}
              </DialogTitle>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(post)}
                className="gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(post.id)}
                className="gap-2 text-destructive hover:text-destructive border-destructive/20 hover:border-destructive"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          {post.imageUrl && !imageError ? (
            <div className="w-full">
              <img
                src={post.imageUrl}
                alt={post.title}
                onError={handleImageError}
                className="w-full h-64 md:h-80 object-cover rounded-lg"
              />
            </div>
          ) : post.imageUrl ? (
            <div className="w-full h-64 md:h-80 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <ImageIcon className="w-12 h-12 mx-auto mb-3" />
                <p className="text-sm">Image failed to load</p>
              </div>
            </div>
          ) : null}

          {/* Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {post.content}
            </div>
          </div>

          {/* Meta Info */}
          {post.updatedAt !== post.createdAt && (
            <div className="pt-4 border-t text-xs text-muted-foreground">
              Last updated: {formatDate(post.updatedAt)}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
