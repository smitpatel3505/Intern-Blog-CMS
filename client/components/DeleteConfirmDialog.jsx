import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";

export default function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  postTitle,
  isLoading,
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-destructive" />
            Delete Blog Post
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete <strong>"{postTitle}"</strong>?
            </p>
            <p className="text-destructive">
              This action cannot be undone. The blog post will be permanently
              removed.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete Post
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
