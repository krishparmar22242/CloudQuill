# CloudQuill - Cloud Note-Taking Application

A full-stack web application that allows users to create, read, update, and delete notes securely in the cloud. CloudQuill provides a seamless note-taking experience with user authentication and real-time synchronization.

## Features

### 🔐 Authentication & Security
- **User Registration & Login** - Create a secure account with email and password
- **JWT Authentication** - Secure token-based authentication for API endpoints
- **Password Encryption** - bcryptjs encryption for secure password storage
- **Protected Routes** - Middleware to protect authenticated endpoints

### 📝 Note Management
- **Create Notes** - Write and save notes with title, description, and tags
- **View Notes** - Display all notes in an organized container
- **Update Notes** - Edit existing notes with real-time updates
- **Delete Notes** - Remove notes permanently
- **Tagging System** - Organize notes with custom tags (default: "Personal")
- **Auto-timestamping** - Each note automatically records creation date

### 🎨 User Interface
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Navigation Bar** - Easy access to all pages and authentication actions
- **Alert System** - Real-time feedback for user actions (success, errors)
- **Clean Layout** - Intuitive design for better user experience

## Tech Stack

### Frontend
- **React 19** - UI library for building interactive components
- **React Router DOM 7** - Client-side routing for navigation
- **React Scripts 5** - Build tools and development server
- **Context API** - Global state management for notes

### Backend
- **Node.js** - JavaScript runtime for server-side code
- **Express 4** - Web framework for API routes
- **MongoDB & Mongoose 8** - NoSQL database and ODM
- **JWT (jsonwebtoken 9)** - Token-based authentication
- **bcryptjs 2** - Password hashing and security
- **CORS** - Cross-Origin Resource Sharing for frontend-backend communication
- **Express Validator 7** - Input validation and sanitization
- **Nodemon** - Auto-restart server during development

## Project Structure

```
CloudQuill/
├── backend/                 # Express.js server
│   ├── models/             # MongoDB schemas
│   │   ├── User.js         # User model with email & password
│   │   └── Notes.js        # Notes model with user reference
│   ├── routes/             # API endpoints
│   │   ├── auth.js         # Authentication endpoints (signup, login)
│   │   └── notes.js        # Notes CRUD endpoints
│   ├── middleware/         # Custom middleware
│   │   └── fetchuser.js    # JWT verification middleware
│   ├── db.js              # MongoDB connection
│   ├── index.js           # Express app setup
│   └── package.json       # Backend dependencies
│
├── src/                     # React frontend
│   ├── components/         # React components
│   │   ├── Navbar.js       # Navigation bar
│   │   ├── Home.js         # Main dashboard
│   │   ├── About.js        # About page
│   │   ├── Login.js        # Login form
│   │   ├── Signup.js       # Registration form
│   │   ├── Addnote.js      # Create note form
│   │   ├── Notes.js        # Individual note display
│   │   ├── Notecontainer.js # Notes list container
│   │   └── Alert.js        # Alert notifications
│   ├── context/            # React Context
│   │   └── notes/
│   │       ├── notecontext.js   # Context creation
│   │       └── Notestate.js     # Context provider with logic
│   ├── App.js             # Main app component with routing
│   ├── App.css            # Global styles
│   ├── index.js           # React entry point
│   └── index.css          # Global CSS
│
├── public/                  # Static assets
│   ├── index.html         # HTML template
│   ├── manifest.json      # PWA manifest
│   └── robots.txt         # SEO robots file
│
├── package.json           # Frontend dependencies
└── README.md             # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance like MongoDB Atlas)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with MongoDB connection string:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

4. Start the backend server:
```bash
npm start
```
The server will run on `http://localhost:5000`

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Update API endpoints in your components to match your backend URL

3. Start the development server:
```bash
npm start
```
The application will open on `http://localhost:3000`

## API Endpoints

### Authentication Routes (`/api/auth`)
- **POST** `/createuser` - Register a new user
  - Body: `{ name, email, password }`
  
- **POST** `/login` - User login
  - Body: `{ email, password }`
  - Returns: JWT token

### Notes Routes (`/api/notes`)
- **GET** `/fetchallnotes` - Get all notes for logged-in user (Protected)
- **POST** `/addnote` - Create a new note (Protected)
  - Body: `{ title, description, tag }`
  
- **PUT** `/updatenote/:id` - Update a note (Protected)
  - Body: `{ title, description, tag }`
  
- **DELETE** `/deletenote/:id` - Delete a note (Protected)

## Usage

1. **Sign Up** - Create a new account on the signup page
2. **Log In** - Access your account with email and password
3. **Create Notes** - Click "Add Note" and fill in title and description
4. **Manage Notes** - View, edit, and delete your notes
5. **Organize** - Use tags to categorize your notes

## Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT-based authentication
- ✅ Protected API routes with middleware
- ✅ Input validation with express-validator
- ✅ CORS protection for API endpoints
- ✅ Unique email constraints in database

## Development

To run both frontend and backend concurrently, you can use:
```bash
npm run concurrently
```

### Available Scripts

**Frontend:**
- `npm start` - Run development server
- `npm run build` - Create production build
- `npm test` - Run tests

**Backend:**
- `npm start` - Run with nodemon (auto-restart on changes)

## Future Enhancements

- [ ] User profile management
- [ ] Note sharing capabilities
- [ ] Collaborative editing
- [ ] Rich text editor
- [ ] Note search and filtering
- [ ] Dark mode support
- [ ] Mobile app (React Native)
- [ ] Cloud storage integration

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## License

This project is licensed under the ISC License.

## Author

**Krish Parmar**

---

**CloudQuill** - Keep your notes always with you in the cloud ☁️📝
