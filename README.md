# BlogCraft - Firebase Blog App

A modern, full-featured blog application built with React and Firebase, featuring authentication, real-time database, and a beautiful UI.

## 🚀 Features

### 🔐 Authentication
- **Email/Password** sign up and sign in
- **GitHub OAuth** login
- User session persistence with localStorage
- Protected routes for authenticated users
- Automatic redirect to login for protected pages

### 🔥 Firestore Database
- Real-time blog posts with fields: `id`, `title`, `content`, `author`, `authorId`, `createdAt`, `updatedAt`, `isAdmin`
- Only authenticated users can create/edit/delete their own posts
- Anyone can read all blog posts (public access)
- User authorization - users can only modify their own content

### 🎨 Modern UI/UX
- Beautiful, responsive design with Tailwind CSS
- Dark/Light theme toggle
- Smooth animations and transitions
- Mobile-first responsive design
- Toast notifications for user feedback

### 📱 Pages & Routes
- **Home** (`/`) - Public blog listing with search and filters
- **Login** (`/login`) - Authentication page
- **Dashboard** (`/dashboard`) - Protected user dashboard with personal posts
- **404** - Not found page

## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### 2. Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Follow the setup wizard

2. **Enable Authentication**
   - In Firebase Console, go to "Authentication" → "Sign-in method"
   - Enable "Email/Password"
   - Enable "GitHub" (you'll need to configure GitHub OAuth app)

3. **Enable Firestore Database**
   - Go to "Firestore Database" → "Create database"
   - Choose "Start in test mode" for development
   - Select a location close to your users

4. **Get Firebase Config**
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click "Add app" → "Web"
   - Copy the config object

### 3. Environment Variables

1. **Create `.env` file** in the root directory:
```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

2. **Replace the values** with your actual Firebase config

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
client/
├── components/          # React components
│   ├── AuthModal.jsx   # Authentication modal
│   ├── BlogCard.jsx    # Blog post card
│   ├── BlogModal.jsx   # Create/edit post modal
│   ├── Navbar.jsx      # Navigation bar
│   ├── ProtectedRoute.jsx # Route protection
│   └── ui/             # UI components (shadcn/ui)
├── hooks/
│   ├── useAuth.jsx     # Authentication hook
│   └── useBlog.jsx     # Blog data management
├── pages/
│   ├── Index.jsx       # Home page
│   ├── Login.jsx       # Login page
│   ├── Dashboard.jsx   # User dashboard
│   └── NotFound.jsx    # 404 page
├── firebase.js         # Firebase configuration
└── main.jsx           # App entry point
```

## 🔧 Configuration

### Firebase Security Rules

For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to posts
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.authorId || resource.data.isAdmin == true);
    }
  }
}
```

### GitHub OAuth Setup

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to: `https://your-project.firebaseapp.com/__/auth/handler`
4. Copy Client ID and Client Secret
5. Add them to Firebase Authentication → GitHub provider

## 🚀 Deployment

### Netlify (Recommended)

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy!

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Add environment variables in Vercel dashboard

## 🎯 Usage

### For Users
1. **Browse Posts**: Visit the home page to see all blog posts
2. **Sign Up/In**: Click "Sign In" to create an account or log in
3. **Create Posts**: Once logged in, click "Write Post" to create content
4. **Manage Posts**: Visit your dashboard to edit/delete your posts
5. **Search & Filter**: Use the search bar and filters to find specific posts

### For Developers
- All authentication state is managed in `useAuth` hook
- Blog data is managed in `useBlog` hook with Firestore integration
- Protected routes automatically redirect to login
- User authorization is handled at the data level

## 🔒 Security Features

- **Authentication Required**: Create, edit, delete operations require login
- **User Authorization**: Users can only modify their own posts
- **Admin Support**: Optional `isAdmin` field for future admin features
- **Input Validation**: Form validation and error handling
- **Secure Storage**: User data stored securely in Firebase

## 🎨 Customization

### Styling
- Uses Tailwind CSS for styling
- Custom CSS variables in `global.css`
- Theme support (light/dark mode)
- Responsive design breakpoints

### Components
- Modular component architecture
- Reusable UI components from shadcn/ui
- Custom hooks for state management
- Toast notifications for user feedback

## 🐛 Troubleshooting

### Common Issues

1. **Firebase not initialized**
   - Check your environment variables
   - Ensure Firebase config is correct

2. **Authentication not working**
   - Verify GitHub OAuth is configured
   - Check Firebase Authentication settings

3. **Posts not loading**
   - Check Firestore security rules
   - Verify database is created and accessible

4. **Build errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check for missing dependencies

## 📝 License

MIT License - feel free to use this project for your own blog!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub. 