# Twitter Clone - Complete Setup Guide

## 🎯 Project Structure

```
twitter/
├── backend/               # Express.js API server
│   ├── config/           # Database & auth configuration
│   ├── controllers/      # Route handlers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API route definitions
│   ├── uploads/          # Static file storage
│   ├── .env             # Environment variables
│   └── index.js         # Server entry point
│
└── frontend/
    └── twitterclone/     # React application
        ├── src/
        │   ├── components/   # React components
        │   ├── redux/        # State management
        │   ├── hooks/        # Custom React hooks
        │   └── utils/        # Constants & utilities
        └── public/
```

---

## 🚀 Complete Setup Instructions

### 1. Prerequisites

Install the following on your system:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community)
- **Git** (optional) - [Download](https://git-scm.com/)

### 2. Start MongoDB

**Windows (Command Prompt/PowerShell):**
```powershell
# Start MongoDB service
net start MongoDB

# Or run mongod directly
mongod --dbpath "C:\data\db"
```

Verify MongoDB is running:
```powershell
# Open MongoDB shell
mongosh
# Should connect to: mongodb://127.0.0.1:27017
```

### 3. Backend Setup

```powershell
# Navigate to backend directory
cd twitter\backend

# Install dependencies
npm install

# Verify .env configuration
# Make sure .env file exists with these values:
```

**backend/.env**:
```properties
PORT=8081
MONGO_URI=mongodb://localhost:27017/twitterclone
TOKEN_SECRET=your_super_secret_jwt_key_change_this_in_production
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8081/api/v1/user/google/callback
```

```powershell
# Start backend development server
npm run dev
```

**Expected output:**
```
[nodemon] starting `node index.js`
Connected to mongoDB
Server listen at port 8081
```

---

### 4. Frontend Setup

Open a **new terminal window**:

```powershell
# Navigate to frontend directory
cd twitter\frontend\twitterclone

# Install dependencies
npm install

# Start React development server
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view twitterclone in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

Browser should automatically open to `http://localhost:3000`

---

## ✅ Verify Setup

### Backend Health Check

1. Open browser to: `http://localhost:8081/uploads/`
   - Should see directory listing or 404 (both mean server is running)

2. Test CORS:
   ```powershell
   curl http://localhost:8081/api/v1/user/otheruser/123
   ```
   - Should return 401 "User not authenticated" (means endpoint works, just needs login)

### Frontend Health Check

1. Open `http://localhost:3000`
2. Should see Twitter clone login page
3. Check browser console - no errors (Tailwind warnings are normal)

---

## 🎨 Current Features

### ✅ Implemented (Backend + Frontend)

**Authentication:**
- ✅ Email/password registration
- ✅ Email/password login
- ✅ Google OAuth (ID token method)
- ✅ Session persistence (JWT cookies)
- ✅ Logout

**User Profile:**
- ✅ View user profile
- ✅ Edit profile picture (avatar)
- ✅ Edit header/banner image
- ✅ Edit bio (160 chars)
- ✅ Edit location (50 chars)
- ✅ Follow/unfollow users
- ✅ View followers/following

**Tweets:**
- ✅ Create tweet (text + optional image)
- ✅ Delete own tweets
- ✅ Like/unlike tweets
- ✅ View user timeline
- ✅ View following feed
- ✅ Upload images with tweets

**UI/UX:**
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Mobile bottom navigation
- ✅ Mobile search overlay
- ✅ Tablet layout optimization
- ✅ Tweet compose modal with image upload
- ✅ Profile setup modals
- ✅ Custom scrollbars
- ✅ Loading states
- ✅ Toast notifications

---

## 🧪 Testing Guide

### 1. Test Registration & Login

```
1. Open http://localhost:3000
2. Click "Create Account"
3. Fill form:
   Name: Test User
   Username: testuser
   Email: test@example.com
   Password: password123
4. Click "Create Account"
5. Should redirect to login
6. Login with test@example.com / password123
7. Should redirect to /home
```

### 2. Test Profile Updates

```
1. Login to application
2. Click profile icon → "Profile"
3. Click "Edit profile" button
4. Update profile picture:
   - Click avatar → upload image
   - Verify image appears
5. Update banner:
   - Click "Edit Header" → upload image
   - Verify banner appears
6. Update bio:
   - Click "Edit Bio" → enter text
   - Save and verify
7. Update location:
   - Click "Edit Location" → enter city
   - Save and verify
```

### 3. Test Tweets

```
1. Login to application
2. Click "Tweet" button (desktop) or + icon (mobile)
3. Type: "This is my first tweet!"
4. Click "Tweet"
5. Verify tweet appears in feed
6. Click image icon → upload image
7. Type: "Tweet with image"
8. Post and verify
9. Click heart icon to like
10. Click trash icon to delete your own tweet
```

### 4. Test Social Features

```
1. Login as user A
2. Go to /home
3. Right sidebar shows "Who to follow"
4. Click "Follow" on user B
5. Verify following count increases
6. Click "Following" tab in feed
7. Should see user B's tweets (if any)
8. Go to user B's profile
9. Click "Unfollow"
10. Verify following count decreases
```

### 5. Test Mobile Responsive

```
1. Open browser DevTools (F12)
2. Click device toolbar (Ctrl+Shift+M)
3. Select iPhone 12 Pro (390x844)
4. Verify:
   - Bottom navigation visible
   - Sidebars hidden
   - Compose modal is bottom-sheet
   - Search icon opens full-screen overlay
5. Switch to iPad (768x1024)
6. Verify:
   - Right sidebar appears below feed
   - Left sidebar visible
7. Switch to Desktop (1280x720)
8. Verify:
   - Both sidebars visible as rails
   - Feed centered
   - Max width 1280px
```

---

## 🐛 Troubleshooting

### Backend won't start

**Error: `connect ECONNREFUSED 127.0.0.1:27017`**
- MongoDB not running
- Solution: Start MongoDB service or run `mongod`

**Error: `PORT already in use`**
- Another process using port 8081
- Solution: Change PORT in .env or kill the process

### Frontend won't start

**Error: `npm ERR! ENOENT`**
- Dependencies not installed
- Solution: Run `npm install` in frontend directory

**Error: `Port 3000 is already in use`**
- Another app using port 3000
- Solution: Use `PORT=3001 npm start` (already configured in backend CORS)

### Can't login

**Error: 401 Unauthorized**
- Check MongoDB is running
- Verify user was created (check MongoDB logs)
- Clear browser cookies and try again

### Images won't upload

**Error: `No file uploaded` or `Only image files allowed`**
- Check file size < 5MB
- Check file type is image (jpeg, png, gif, webp)
- Verify `backend/uploads/` directory exists

### CORS errors in browser console

**Error: `Access-Control-Allow-Origin`**
- Backend not running on port 8081
- Frontend not on port 3000 or 3001
- Check CORS config in backend/index.js

### Session not persisting

**Error: Redirected to /login after refresh**
- JWT cookie not being set/sent
- Check cookie settings in browser (3rd party cookies)
- Verify `withCredentials: true` in axios requests
- Check backend sends `credentials: true` in CORS

---

## 📚 API Documentation

Full API documentation available in: `backend/API_DOCUMENTATION.md`

Quick reference:
- **Backend Base URL**: `http://localhost:8081/api/v1`
- **User endpoints**: `/user/*`
- **Tweet endpoints**: `/tweet/*`
- **Static files**: `/uploads/*`

---

## 🔐 Google OAuth Setup (Optional)

To enable Google Sign-In:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:8081/api/v1/user/google/callback`
5. Copy Client ID and Client Secret
6. Update backend/.env:
   ```
   GOOGLE_CLIENT_ID=your_actual_client_id
   GOOGLE_CLIENT_SECRET=your_actual_client_secret
   ```
7. Restart backend server

---

## 🎯 Next Steps

### Recommended Development Flow

1. **Make backend changes:**
   - Edit files in `backend/controllers/` or `backend/routes/`
   - Nodemon auto-restarts server
   - Test with Postman or Thunder Client

2. **Make frontend changes:**
   - Edit files in `frontend/twitterclone/src/`
   - React hot-reloads automatically
   - Check browser console for errors

3. **Test integration:**
   - Use browser DevTools Network tab
   - Monitor backend console for logs
   - Test all CRUD operations

### Learning Resources

- **Express.js**: https://expressjs.com/
- **React**: https://react.dev/
- **Redux Toolkit**: https://redux-toolkit.js.org/
- **Tailwind CSS**: https://tailwindcss.com/
- **MongoDB**: https://www.mongodb.com/docs/
- **JWT Authentication**: https://jwt.io/introduction

---

## 📝 Project Status

**Completion**: ~95% ✅

**What's working:**
- Complete authentication system
- Full CRUD for tweets
- User profiles with image uploads
- Follow/unfollow system
- Responsive UI for all screen sizes
- Mobile-optimized experience

**Optional enhancements:**
- [ ] Tweet comments/replies
- [ ] Retweets
- [ ] Notifications
- [ ] Direct messages
- [ ] Hashtags & mentions
- [ ] Tweet search
- [ ] Bookmark feature (backend exists, frontend not implemented)
- [ ] Trending topics
- [ ] User verification badges

**Backend is complete for all current frontend features!** 🎉

---

## 🤝 Contributing

### Adding New Features

1. **Backend:**
   - Add route in `routes/`
   - Add controller in `controllers/`
   - Update model in `models/` if needed
   - Test with API client
   - Document in API_DOCUMENTATION.md

2. **Frontend:**
   - Create component in `components/`
   - Add Redux slice if needed
   - Create custom hook for API calls
   - Style with Tailwind CSS
   - Test on mobile/tablet/desktop

### Code Style

- **Backend**: ES6+ modules, async/await, clear error handling
- **Frontend**: Functional components, hooks, Redux Toolkit, Tailwind classes
- **Comments**: Explain complex logic, not obvious code
- **Naming**: camelCase for functions/variables, PascalCase for components

---

## 📞 Support

If you encounter issues:

1. Check this documentation
2. Review API_DOCUMENTATION.md
3. Check browser console for errors
4. Check backend console for server errors
5. Verify MongoDB is running and connected
6. Clear browser cache and cookies
7. Try incognito mode to rule out extensions

---

## 🎉 Congratulations!

Your Twitter clone is now fully functional with:
- ✅ Complete backend API (19 endpoints)
- ✅ Responsive React frontend
- ✅ Authentication & authorization
- ✅ File uploads & static serving
- ✅ Social features (follow, like, tweet)
- ✅ Mobile-first design

**Happy coding!** 🚀
