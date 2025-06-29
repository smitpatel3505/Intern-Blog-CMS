import { createContext, useContext, useReducer, useEffect } from "react";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';

const BlogContext = createContext();

const initialState = {
  posts: [],
  isLoading: false,
  error: null,
};

// Sample initial data for demonstration
const samplePosts = [
  {
    id: "1",
    title: "Getting Started with React Development",
    author: "Sarah Johnson",
    content:
      "React has revolutionized the way we build user interfaces. In this comprehensive guide, we'll explore the fundamentals of React development, from setting up your environment to building complex applications. We'll cover components, state management, hooks, and best practices that will help you become a proficient React developer.",
    imageUrl:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    title: "The Future of Web Development",
    author: "Mike Chen",
    content:
      "The landscape of web development is constantly evolving. With new frameworks, tools, and methodologies emerging regularly, it's crucial to stay updated with the latest trends. This article explores the current state of web development and predictions for the future, including the rise of serverless architecture, AI integration, and progressive web applications.",
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
    createdAt: "2024-01-14T15:45:00Z",
    updatedAt: "2024-01-14T15:45:00Z",
  },
  {
    id: "3",
    title: "Building Responsive Designs with Tailwind CSS",
    author: "Emily Rodriguez",
    content:
      "Tailwind CSS has become one of the most popular utility-first CSS frameworks. Its approach to styling differs significantly from traditional CSS methodologies. In this tutorial, we'll learn how to create beautiful, responsive designs using Tailwind's utility classes, custom components, and responsive design principles.",
    imageUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
    createdAt: "2024-01-13T09:20:00Z",
    updatedAt: "2024-01-13T09:20:00Z",
  },
];

function blogReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };

    case "SET_POSTS":
      return { ...state, posts: action.payload, isLoading: false, error: null };

    case "ADD_POST":
      return {
        ...state,
        posts: [action.payload, ...state.posts],
        isLoading: false,
        error: null,
      };

    case "UPDATE_POST":
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.id ? action.payload : post
        ),
        isLoading: false,
        error: null,
      };

    case "DELETE_POST":
      return {
        ...state,
        posts: state.posts.filter((post) => post.id !== action.payload),
        isLoading: false,
        error: null,
      };

    default:
      return state;
  }
}

export function BlogProvider({ children }) {
  const [state, dispatch] = useReducer(blogReducer, initialState);
  const { user } = useAuth();

  // Load posts from Firestore
  useEffect(() => {
    const loadPosts = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      
      try {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const posts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
          updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt
        }));
        
        dispatch({ type: "SET_POSTS", payload: posts });
      } catch (error) {
        console.error('Error loading posts:', error);
        dispatch({ type: "SET_ERROR", payload: "Failed to load posts" });
      }
    };

    loadPosts();
  }, []);

  // Create new post
  const createPost = async (postData) => {
    if (!user) {
      throw new Error('You must be logged in to create a post');
    }

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const postsRef = collection(db, 'posts');
      const newPost = {
        ...postData,
        author: user.displayName || user.email,
        authorId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isAdmin: false // Default value, can be updated manually in Firestore
      };

      const docRef = await addDoc(postsRef, newPost);
      
      const createdPost = {
        id: docRef.id,
        ...newPost,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      dispatch({ type: "ADD_POST", payload: createdPost });
      return createdPost;
    } catch (error) {
      console.error('Error creating post:', error);
      dispatch({ type: "SET_ERROR", payload: "Failed to create post" });
      throw error;
    }
  };

  // Update existing post
  const updatePost = async (postData) => {
    if (!user) {
      throw new Error('You must be logged in to update a post');
    }

    const post = state.posts.find(p => p.id === postData.id);
    if (!post) {
      throw new Error('Post not found');
    }

    // Check if user is the author or admin
    if (post.authorId !== user.uid && !post.isAdmin) {
      throw new Error('You can only update your own posts');
    }

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const postRef = doc(db, 'posts', postData.id);
      const updateData = {
        ...postData,
        updatedAt: serverTimestamp()
      };

      await updateDoc(postRef, updateData);

      const updatedPost = {
        ...postData,
        updatedAt: new Date().toISOString()
      };

      dispatch({ type: "UPDATE_POST", payload: updatedPost });
      return updatedPost;
    } catch (error) {
      console.error('Error updating post:', error);
      dispatch({ type: "SET_ERROR", payload: "Failed to update post" });
      throw error;
    }
  };

  // Delete post
  const deletePost = async (postId) => {
    if (!user) {
      throw new Error('You must be logged in to delete a post');
    }

    const post = state.posts.find(p => p.id === postId);
    if (!post) {
      throw new Error('Post not found');
    }

    // Check if user is the author or admin
    if (post.authorId !== user.uid && !post.isAdmin) {
      throw new Error('You can only delete your own posts');
    }

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const postRef = doc(db, 'posts', postId);
      await deleteDoc(postRef);
      dispatch({ type: "DELETE_POST", payload: postId });
    } catch (error) {
      console.error('Error deleting post:', error);
      dispatch({ type: "SET_ERROR", payload: "Failed to delete post" });
      throw error;
    }
  };

  // Get posts by current user
  const getUserPosts = () => {
    if (!user) return [];
    return state.posts.filter(post => post.authorId === user.uid);
  };

  const value = {
    ...state,
    createPost,
    updatePost,
    deletePost,
    getUserPosts
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
}
