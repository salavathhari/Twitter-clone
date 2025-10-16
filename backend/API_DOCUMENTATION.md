# Twitter Clone - Backend API Documentation

## 🚀 Quick Start

```powershell
# Navigate to backend directory
cd backend

# Install dependencies (if not already installed)
npm install

# Start development server with nodemon
npm run dev
```

Server runs on: `http://localhost:8081`

## 📋 Prerequisites

1. **MongoDB** running on `mongodb://localhost:27017/twitterclone`
2. **Environment Variables** configured in `.env` file:
   - `PORT=8081`
   - `MONGO_URI=mongodb://localhost:27017/twitterclone`
   - `TOKEN_SECRET=your_jwt_secret_key`
   - `GOOGLE_CLIENT_ID=your_google_client_id`
   - `GOOGLE_CLIENT_SECRET=your_google_client_secret`
   - `GOOGLE_REDIRECT_URI=http://localhost:8081/api/v1/user/google/callback`

## 🔐 Authentication

All authenticated endpoints require a JWT token stored in an httpOnly cookie named `token`.

### Cookie Configuration
- **httpOnly**: true
- **sameSite**: lax
- **path**: /
- **maxAge**: 24 hours (86400000 ms)

---

## 📚 API Endpoints

### **User Authentication**

#### Register New User
```http
POST /api/v1/user/register
Content-Type: application/json

{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```
**Response**: `201 Created`
```json
{
  "message": "Account created successfully.",
  "success": true
}
```

---

#### Login
```http
POST /api/v1/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```
**Response**: `201 Created` + Sets `token` cookie
```json
{
  "message": "Welcome back John Doe",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": null,
    "banner": null,
    "bio": "",
    "location": "",
    "followers": [],
    "following": [],
    "bookmarks": []
  },
  "success": true
}
```

---

#### Google OAuth - ID Token Method
```http
POST /api/v1/user/google
Content-Type: application/json

{
  "idToken": "google_id_token_from_frontend"
}
```
**Response**: `200 OK` + Sets `token` cookie
```json
{
  "message": "Welcome John Doe",
  "user": { /* user object */ },
  "success": true
}
```

---

#### Google OAuth - Authorization Code Flow
```http
GET /api/v1/user/google/start?returnTo=http://localhost:3000/home
```
Redirects user to Google consent screen, then to callback.

```http
GET /api/v1/user/google/callback?code=...&state=...
```
Processes OAuth code, creates/logs in user, sets cookie, redirects to `returnTo` URL.

---

#### Logout
```http
GET /api/v1/user/logout
Cookie: token=jwt_token
```
**Response**: `200 OK` + Clears `token` cookie
```json
{
  "message": "user logged out successfully.",
  "success": true
}
```

---

#### Get Current User (Session Restore)
```http
GET /api/v1/user/me
Cookie: token=jwt_token
```
**Response**: `200 OK`
```json
{
  "user": { /* current user object without password */ },
  "success": true
}
```

---

### **User Profile**

#### Get User Profile
```http
GET /api/v1/user/profile/:id
Cookie: token=jwt_token
```
**Response**: `200 OK`
```json
{
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "username": "johndoe",
    "avatar": "/uploads/1234567890-avatar.jpg",
    "banner": "/uploads/1234567890-banner.jpg",
    "bio": "Software developer",
    "location": "San Francisco, CA",
    "followers": ["userId1", "userId2"],
    "following": ["userId3"],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### Get Other Users (Suggestions)
```http
GET /api/v1/user/otheruser/:id
Cookie: token=jwt_token
```
Returns all users except the specified ID (useful for follow suggestions).

**Response**: `200 OK`
```json
{
  "otherUsers": [
    { /* user object */ },
    { /* user object */ }
  ]
}
```

---

#### Update Profile Picture
```http
POST /api/v1/user/avatar
Content-Type: multipart/form-data
Cookie: token=jwt_token

avatar: [image file]
```
**Constraints**: 
- Max file size: 5MB
- Only image files allowed (image/*)

**Response**: `200 OK`
```json
{
  "message": "Profile photo updated",
  "user": { /* updated user object */ },
  "success": true
}
```

---

#### Update Header/Banner Image
```http
POST /api/v1/user/banner
Content-Type: multipart/form-data
Cookie: token=jwt_token

banner: [image file]
```
**Constraints**: Same as avatar

**Response**: `200 OK`
```json
{
  "message": "Header updated",
  "user": { /* updated user object */ },
  "success": true
}
```

---

#### Update Bio
```http
POST /api/v1/user/bio
Content-Type: application/json
Cookie: token=jwt_token

{
  "bio": "Software developer passionate about web technologies"
}
```
**Constraints**: Max 160 characters

**Response**: `200 OK`
```json
{
  "message": "Bio updated",
  "user": { /* updated user object */ },
  "success": true
}
```

---

#### Update Location
```http
POST /api/v1/user/location
Content-Type: application/json
Cookie: token=jwt_token

{
  "location": "San Francisco, CA"
}
```
**Constraints**: Max 50 characters

**Response**: `200 OK`
```json
{
  "message": "Location updated",
  "user": { /* updated user object */ },
  "success": true
}
```

---

### **Social Features**

#### Follow User
```http
POST /api/v1/user/follow/:id
Content-Type: application/json
Cookie: token=jwt_token

{
  "id": "current_user_id"
}
```
**Response**: `200 OK`
```json
{
  "message": "John just follow to Jane",
  "success": true
}
```

---

#### Unfollow User
```http
POST /api/v1/user/unfollow/:id
Content-Type: application/json
Cookie: token=jwt_token

{
  "id": "current_user_id"
}
```
**Response**: `200 OK`
```json
{
  "message": "John unfollow to Jane",
  "success": true
}
```

---

#### Bookmark Tweet (Not used in current frontend)
```http
PUT /api/v1/user/bookmark/:id
Content-Type: application/json
Cookie: token=jwt_token

{
  "id": "current_user_id"
}
```
Toggles bookmark for tweet `:id`.

---

### **Tweets**

#### Create Tweet
```http
POST /api/v1/tweet/create
Content-Type: multipart/form-data
Cookie: token=jwt_token

description: "This is my first tweet!"
id: current_user_id
image: [optional image file]
```
**Constraints**: 
- Description or image required (at least one)
- Image max size: 5MB, image/* only

**Response**: `201 Created`
```json
{
  "message": "Tweet created successfully.",
  "success": true
}
```

---

#### Get User's Tweets
```http
GET /api/v1/tweet/alltweets/:id
Cookie: token=jwt_token
```
Returns all tweets created by user `:id`, sorted by newest first.

**Response**: `200 OK`
```json
{
  "tweets": [
    {
      "_id": "tweet_id",
      "description": "Tweet text",
      "image": "/uploads/1234567890-image.jpg",
      "like": ["userId1", "userId2"],
      "userId": "user_id",
      "userDetails": [{ /* user object */ }],
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

---

#### Get Following Users' Tweets
```http
GET /api/v1/tweet/followingtweets/:id
Cookie: token=jwt_token
```
Returns tweets from all users that `:id` follows.

**Response**: Same format as `alltweets`

---

#### Like/Unlike Tweet
```http
PUT /api/v1/tweet/like/:id
Content-Type: application/json
Cookie: token=jwt_token

{
  "id": "current_user_id"
}
```
Toggles like status for tweet `:id`.

**Response**: `200 OK`
```json
{
  "message": "User liked your tweet."
}
```
or
```json
{
  "message": "User disliked your tweet."
}
```

---

#### Delete Tweet
```http
DELETE /api/v1/tweet/delete/:id
Cookie: token=jwt_token
```
**Response**: `200 OK`
```json
{
  "message": "Tweet deleted successfully.",
  "success": true
}
```

---

## 📁 Static Files

Uploaded images are served from:
```
http://localhost:8081/uploads/filename.jpg
```

Files are stored in `backend/uploads/` directory.

---

## 🛠️ Middleware

### `isAuthenticated`
Verifies JWT token from cookie. Extracts `userId` and attaches to `req.user`.

**Usage**: Applied to all protected routes
```javascript
router.route("/profile/:id").get(isAuthenticated, getMyProfile);
```

---

## 🗄️ Database Models

### User Schema
```javascript
{
  name: String (required),
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  avatar: String (default: null),
  banner: String (default: null),
  bio: String (default: ""),
  location: String (default: ""),
  followers: Array (default: []),
  following: Array (default: []),
  bookmarks: Array (default: []),
  timestamps: true
}
```

### Tweet Schema
```javascript
{
  description: String (required),
  like: Array (default: []),
  image: String (default: null),
  userId: ObjectId (ref: "User"),
  userDetails: Array (default: []),
  timestamps: true
}
```

---

## ⚠️ Error Handling

All errors are caught by global error handler:
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.message) {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: 'Internal Server Error' });
});
```

Multer errors (file size, type) are handled automatically.

---

## 🧪 Testing Checklist

- [ ] Register new user
- [ ] Login with email/password
- [ ] Restore session with /me endpoint
- [ ] Upload profile picture
- [ ] Upload banner image
- [ ] Update bio and location
- [ ] Follow/unfollow users
- [ ] Create tweet (text only)
- [ ] Create tweet (with image)
- [ ] Like/unlike tweet
- [ ] Delete tweet
- [ ] Get user profile with tweets
- [ ] Get following feed
- [ ] Google OAuth flow
- [ ] Logout and clear session

---

## 🔧 CORS Configuration

Allows requests from:
- `http://localhost:3000` (default CRA)
- `http://localhost:3001` (alternate port)

Credentials (cookies) enabled: `credentials: true`

---

## 📦 Dependencies

```json
{
  "bcryptjs": "^2.4.3",
  "cookie-parser": "^1.4.6",
  "cors": "^2.8.5",
  "dotenv": "^16.4.5",
  "express": "^4.18.3",
  "google-auth-library": "^9.14.1",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.2.0",
  "multer": "^2.0.2",
  "nodemon": "^3.1.0"
}
```

---

## 📝 Notes

1. **Password Hashing**: bcryptjs with 16 salt rounds
2. **JWT Expiry**: 24 hours (1d)
3. **File Storage**: Local filesystem in `backend/uploads/`
4. **Image Validation**: Only `image/*` MIME types accepted
5. **Max Upload Size**: 5MB per file
6. **Username Generation**: Auto-generated from email/name for Google OAuth users, with uniqueness check
7. **Error Logging**: All errors logged to console via `console.log(error)`

---

## 🚨 Security Considerations

- JWT stored in httpOnly cookie (XSS protection)
- Passwords hashed with bcrypt
- CORS restricted to localhost origins
- File upload size limits enforced
- File type validation (images only)
- Authentication required for all sensitive endpoints
- sameSite: 'lax' prevents CSRF in most cases

---

## 🎯 Future Enhancements

Potential improvements (not required for current frontend):
- Add rate limiting
- Implement refresh tokens
- Add tweet comments/replies
- Implement retweets
- Add notifications
- Paginate tweet feeds
- Add search functionality
- Implement direct messaging
- Add email verification
- Use cloud storage (S3, Cloudinary) for images
