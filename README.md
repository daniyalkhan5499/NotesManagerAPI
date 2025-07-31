Notes Manager API
A robust backend API for a Note-Taking Application built with Node.js, Express, and MongoDB. This API provides secure user authentication and full CRUD functionality for notes management.

Key Features
🔐 Secure Authentication

User registration and login with JWT (JSON Web Tokens)

Protected routes for authorized access only

📝 Full Notes Management

Create, read, update, and delete notes

Pin important notes for quick access

Search functionality for notes by title or content

Getting Started
Prerequisites
Node.js (v14 or higher recommended)

MongoDB (local instance or cloud service like MongoDB Atlas)

Installation
Clone the repository

bash
git clone https://github.com/daniyalkhan5499/NotesManagerAPI.git
cd NotesManagerAPI
Install dependencies

bash
npm install
Configure environment variables

Create a .env file in the root directory with:

bash
ACCESS_TOKEN_SECRET=your-secret-key-here
MONGO_URI=your-mongodb-connection-string
Start the server

bash
npm start
The API will be available at http://localhost:8000

API Endpoints
Authentication
Method	Endpoint	Description
POST	/create-account	Register a new user
POST	/login	Authenticate existing user
GET	/get-user	Get user details (requires auth)
Notes Management
Method	Endpoint	Description
POST	/add-note	Create a new note
GET	/get-all-notes	Retrieve all user's notes
POST	/edit-note/:noteId	Update a specific note
DELETE	/delete-note/:noteId	Remove a note
PUT	/update-note-pinned/:noteId	Toggle pinned status of a note
Usage
First, register a user account or log in to obtain a JWT token

Include the token in the Authorization header for all protected routes

Use the endpoints to manage your notes:

Create and organize notes

Pin important notes for quick access

Search through your notes collection
