import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBlog } from '../hooks/useBlog';
import Navbar from '../components/Navbar';
import BlogCard from '../components/BlogCard';
import BlogModal from '../components/BlogModal';
import BlogViewModal from '../components/BlogViewModal';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  PlusCircle,
  User,
  Calendar,
  FileText,
  Loader2,
  Filter,
  SortAsc,
  SortDesc,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { user } = useAuth();
  const { posts, isLoading, createPost, updatePost, deletePost, getUserPosts } = useBlog();

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [viewingPost, setViewingPost] = useState(null);
  const [deletingPostId, setDeletingPostId] = useState(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Get user's posts
  const userPosts = getUserPosts();

  // Filter and sort user's posts
  const filteredAndSortedPosts = userPosts
    .filter((post) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(query) ||
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
    setEditingPost(post);
    setIsViewModalOpen(false);
  };

  const handleViewPost = (post) => {
    setViewingPost(post);
    setIsViewModalOpen(true);
  };

  const handleDeletePost = (postId) => {
    const post = userPosts.find((p) => p.id === postId);
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

  const deletingPost = userPosts.find((p) => p.id === deletingPostId);

  if (isLoading && userPosts.length === 0) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>
        <Navbar onCreatePost={() => setIsCreateModalOpen(true)} />
        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] relative">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="relative">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                <Loader2 className="w-10 h-10 animate-spin text-white" />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold gradient-text">Loading Dashboard</h3>
              <p className="text-muted-foreground text-lg">Preparing your content...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>

      <Navbar onCreatePost={() => setIsCreateModalOpen(true)} />

      {/* Dashboard Header */}
      <section className="relative border-b border-border/30">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-purple-50/50 to-pink-50/30 dark:from-blue-950/30 dark:via-purple-950/20 dark:to-pink-950/10"></div>
        
        <div className="relative container mx-auto px-6 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
                Welcome back,{" "}
                <span className="gradient-text">{user?.displayName || 'Writer'}!</span>
              </h1>
            </div>

            <div className="animate-fade-in-up delay-200">
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                Manage your blog posts, track your content, and continue sharing your stories with the world.
              </p>
            </div>

            <div className="animate-fade-in-up delay-400 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-gradient text-white border-0 gap-3 text-lg px-8 py-4 h-auto font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                <PlusCircle className="w-6 h-6" />
                Create New Post
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b border-border/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{userPosts.length}</h3>
              <p className="text-muted-foreground">Total Posts</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {userPosts.length > 0 ? new Date(userPosts[0].createdAt).toLocaleDateString() : 'N/A'}
              </h3>
              <p className="text-muted-foreground">Latest Post</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <User className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{user?.displayName || 'Writer'}</h3>
              <p className="text-muted-foreground">Your Name</p>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section id="posts-section" className="py-16">
        <div className="container mx-auto px-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your posts..."
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
              </SelectContent>
            </Select>
          </div>

          {/* Posts Grid */}
          {filteredAndSortedPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <FileText className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4">No posts yet</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Start your writing journey by creating your first blog post. Share your thoughts, stories, and insights with the world.
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-gradient text-white border-0 gap-3 px-8 py-4 h-auto font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <PlusCircle className="w-5 h-5" />
                Create Your First Post
              </Button>
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
                  showActions={true}
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
        showActions={true}
      />

      <DeleteConfirmDialog
        isOpen={!!deletingPostId}
        onClose={() => setDeletingPostId(null)}
        onConfirm={confirmDeletePost}
        title="Delete Post"
        description={`Are you sure you want to delete "${deletingPost?.title}"? This action cannot be undone.`}
      />
    </div>
  );
} 