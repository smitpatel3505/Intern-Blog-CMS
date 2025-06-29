import { useState } from "react";
import { useBlog } from "../hooks/useBlog.jsx";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import BlogCard from "../components/BlogCard";
import BlogModal from "../components/BlogModal";
import BlogViewModal from "../components/BlogViewModal";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import AuthModal from "../components/AuthModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  PlusCircle,
  BookOpen,
  Loader2,
  Filter,
  SortAsc,
  SortDesc,
  Lock,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Index() {
  const { posts, isLoading, createPost, updatePost, deletePost } = useBlog();
  const { user } = useAuth();

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [viewingPost, setViewingPost] = useState(null);
  const [deletingPostId, setDeletingPostId] = useState(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Filter and sort posts
  const filteredAndSortedPosts = posts
    .filter((post) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.localeCompare(b.author);
        default:
          return 0;
      }
    });

  // Handlers
  const handleCreatePost = async (postData) => {
    try {
      await createPost(postData);
      setIsCreateModalOpen(false);
      toast.success("Blog post created successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to create post");
    }
  };

  const handleUpdatePost = async (postData) => {
    try {
      await updatePost(postData);
      setEditingPost(null);
      toast.success("Blog post updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update post");
    }
  };

  const handleEditPost = (post) => {
    if (!user) {
      toast.error("You must be logged in to edit posts");
      return;
    }
    if (post.authorId !== user.uid) {
      toast.error("You can only edit your own posts");
      return;
    }
    setEditingPost(post);
    setIsViewModalOpen(false);
  };

  const handleViewPost = (post) => {
    setViewingPost(post);
    setIsViewModalOpen(true);
  };

  const handleDeletePost = (postId) => {
    if (!user) {
      toast.error("You must be logged in to delete posts");
      return;
    }
    const post = posts.find((p) => p.id === postId);
    if (post && post.authorId !== user.uid) {
      toast.error("You can only delete your own posts");
      return;
    }
    if (post) {
      setDeletingPostId(postId);
    }
  };

  const confirmDeletePost = async () => {
    if (deletingPostId) {
      try {
        await deletePost(deletingPostId);
        setDeletingPostId(null);
        setIsViewModalOpen(false);
        toast.success("Blog post deleted successfully!");
      } catch (error) {
        toast.error(error.message || "Failed to delete post");
      }
    }
  };

  const handleCreatePostClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      toast.info("Please sign in to create a post");
    } else {
      setIsCreateModalOpen(true);
    }
  };

  const deletingPost = posts.find((p) => p.id === deletingPostId);

  if (isLoading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>

        <Navbar onCreatePost={handleCreatePostClick} />
        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] relative">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="relative">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                <Loader2 className="w-10 h-10 animate-spin text-white" />
              </div>
              <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-400/30 to-purple-400/30 animate-ping"></div>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-bold gradient-text">
                Loading BlogCraft
              </h3>
              <p className="text-muted-foreground text-lg">
                Preparing your amazing content...
              </p>

              <div className="loading-dots justify-center mt-4">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>

      <Navbar onCreatePost={handleCreatePostClick} />

      {/* Hero Section */}
      <section className="relative border-b border-border/30">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-purple-50/50 to-pink-50/30 dark:from-blue-950/30 dark:via-purple-950/20 dark:to-pink-950/10"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative container mx-auto px-6 py-24 md:py-32 pb-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-tight pb-5">
                Welcome to{" "}
                <span className="gradient-text block mt-2">BlogCraft</span>
              </h1>
            </div>

            <div className="animate-fade-in-up delay-200">
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
                Discover amazing stories, insights, and perspectives from our
                community of writers. Share your own thoughts and connect with
                readers around the world.
              </p>
            </div>

            <div className="animate-fade-in-up delay-400 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={handleCreatePostClick}
                className="btn-gradient text-white border-0 gap-3 text-lg px-8 py-4 h-auto font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                <PlusCircle className="w-6 h-6" />
                {user ? 'Start Writing' : 'Sign In to Write'}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="gap-3 text-lg px-8 py-4 h-auto font-semibold border-2 hover:bg-accent/50 transition-all duration-300"
                onClick={() => {
                  document.getElementById("posts-section")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                <BookOpen className="w-6 h-6" />
                Explore Posts
              </Button>
            </div>

            {!user && (
              <div className="animate-fade-in-up delay-600 mt-8 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Sign in to create, edit, and manage your own blog posts
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section id="posts-section" className="py-16">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Latest{" "}
              <span className="gradient-text">Stories</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore the latest posts from our community of writers and discover
              new perspectives on various topics.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">By Title</SelectItem>
                <SelectItem value="author">By Author</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Posts Grid */}
          {filteredAndSortedPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4">No posts found</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {searchQuery
                  ? `No posts match your search for "${searchQuery}"`
                  : "Be the first to share a story with our community!"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={handleCreatePostClick}
                  className="btn-gradient text-white border-0 gap-3 px-8 py-4 h-auto font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <PlusCircle className="w-5 h-5" />
                  {user ? 'Create First Post' : 'Sign In to Create'}
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  onView={() => handleViewPost(post)}
                  onEdit={() => handleEditPost(post)}
                  onDelete={() => handleDeletePost(post.id)}
                  showActions={user && post.authorId === user.uid}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      <BlogModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />

      <BlogModal
        isOpen={!!editingPost}
        onClose={() => setEditingPost(null)}
        onSubmit={handleUpdatePost}
        editingPost={editingPost}
      />

      <BlogViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        post={viewingPost}
        onEdit={() => handleEditPost(viewingPost)}
        onDelete={() => handleDeletePost(viewingPost?.id)}
        showActions={user && viewingPost?.authorId === user.uid}
      />

      <DeleteConfirmDialog
        isOpen={!!deletingPostId}
        onClose={() => setDeletingPostId(null)}
        onConfirm={confirmDeletePost}
        title="Delete Post"
        description={`Are you sure you want to delete "${deletingPost?.title}"? This action cannot be undone.`}
      />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
}
