import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function BlogModal({
  isOpen,
  onClose,
  onSubmit,
  editingPost,
  isLoading,
}) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");

  // Reset form when modal opens/closes or editing post changes
  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title || "",
        content: editingPost.content || "",
        imageUrl: editingPost.imageUrl || "",
      });
      setImagePreview(editingPost.imageUrl || "");
    } else {
      setFormData({
        title: "",
        content: "",
        imageUrl: "",
      });
      setImagePreview("");
    }
    setErrors({});
  }, [editingPost, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    } else if (formData.content.length < 10) {
      newErrors.content = "Content must be at least 10 characters";
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    // Update image preview
    if (field === "imageUrl") {
      if (value && isValidUrl(value)) {
        setImagePreview(value);
      } else {
        setImagePreview("");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    const submitData = {
      ...formData,
      // Trim whitespace
      title: formData.title.trim(),
      content: formData.content.trim(),
      imageUrl: formData.imageUrl.trim(),
    };

    if (editingPost) {
      submitData.id = editingPost.id;
    }

    onSubmit(submitData);
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
          </DialogTitle>
          <DialogDescription>
            {editingPost
              ? "Update your blog post details below."
              : "Fill in the details to create a new blog post."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter blog post title..."
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={errors.title ? "border-destructive" : ""}
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (optional)</Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange("imageUrl", e.target.value)}
              className={errors.imageUrl ? "border-destructive" : ""}
              disabled={isLoading}
            />
            {errors.imageUrl && (
              <p className="text-sm text-destructive">{errors.imageUrl}</p>
            )}

            {/* Image Preview */}
            {imagePreview ? (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-md border"
                  onError={() => setImagePreview("")}
                />
              </div>
            ) : formData.imageUrl ? (
              <div className="mt-2 p-4 border border-dashed rounded-md text-center text-muted-foreground">
                <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Invalid image URL</p>
              </div>
            ) : null}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">
              Content <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="content"
              placeholder="Write your blog post content..."
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              className={`min-h-[200px] resize-none ${errors.content ? "border-destructive" : ""}`}
              disabled={isLoading}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.content.length} characters
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingPost ? "Update Post" : "Create Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
