Notes Manager API
Description
This is a backend API for a Note-Taking Application built with Node.js and Express. The API allows users to register, log in, and perform CRUD operations (Create, Read, Update, Delete) on notes with JWT (JSON Web Token) authentication. The notes can also be pinned for easy access.

Features
User Authentication: Register and log in with JWT-based authentication.

CRUD Operations: Create, read, update, and delete notes.

Pinned Notes: Users can pin important notes for quick access.

Search Notes: Users can search for notes by title or content.

Installation
Prerequisites
Node.js: Ensure you have Node.js installed. You can download it from the Node.js official website.

MongoDB: You will need MongoDB either running locally or use a cloud database like MongoDB Atlas.

Steps to Setup
Clone the repository:

bash
Copy
git clone https://github.com/daniyalkhan5499/NotesManagerAPI.git
cd NotesManagerAPI
Install dependencies:

bash
Copy
npm install
Set up environment variables:

Create a .env file in the root folder and add the following keys:

bash
Copy
ACCESS_TOKEN_SECRET=your-secret-key
MONGO_URI=your-mongodb-connection-string
Start the backend server:

bash
Copy
npm start
The API will be running at http://localhost:8000.

API Endpoints
User Authentication
POST /create-account
Register a new user. Returns JWT token on success.

POST /login
Login with email and password. Returns JWT token on success.

GET /get-user
Get user details (requires token).

Notes
POST /add-note
Add a new note (requires token).

GET /get-all-notes
Get all notes (requires token).

POST /edit-note/:noteId
Edit a note by ID (requires token).

DELETE /delete-note/:noteId
Delete a note by ID (requires token).

PUT /update-note-pinned/:noteId
Update the pinned status of a note (requires token).

Usage
The backend API provides endpoints for handling user authentication and note management. The API uses JWT for user authentication, ensuring that only authorized users can interact with their notes.
