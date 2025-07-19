17-07-2025: I hope this mission works, I have limited amount of time wohooo

19:07-2025: I am now documenting this through my Teams Assignments so I could have some rest before I fully pass out



Instructions for Local Deployment:
# Character Maker Application

## Overview
This is a Node.js and Express-based web application for managing characters. The app connects to a MongoDB database using Mongoose to store, create, edit, and delete characters. Users can add new characters, view character details, edit existing characters, and delete them as needed.

## Technologies Used
- Node.js
- Express.js
- MongoDB with Mongoose
- EJS (Embedded JavaScript) for templating
- Method-Override middleware for handling PUT and DELETE methods in forms

## Features
- View a list of all characters.
- Add a new character with attributes like name, attack, defense, health, and description.
- View details of individual characters.
- Edit character attributes.
- Delete characters.

## Setup and Installation

### Prerequisites
- Node.js installed
- MongoDB connection (MongoDB Atlas or local MongoDB setup)

### Steps

1. Install the required dependencies.
    ```bash
    cd Character-Maker
    npm install
    ```
2. Start the application.
    ```bash
    node index.js
    ```
3. Visit the app in your browser at `http://localhost:8080`.

## Usage
- **Main Page**: Displays a list of all characters.
- **Add Character**: Navigate to 'Add New Character' button to add a new character.
- **View Character**: Click on a character from the list to view more details.
- **Edit Character**: On a character's detail page, click "Edit" to modify the character's attributes.
- **Delete Character**: Use the "Delete" option on the character's detail page to remove the character from the database.

## File Structure
- **models/**: Contains the Mongoose schema for the Character.
- **views/**: EJS templates for rendering character lists, forms, and details.
- **index.js**: Main application file where routes, middleware, and database connection are set up.



# Deploying Character Maker to Render
## Prerequisites:

- A Render account (https://render.com)

- Your project pushed to a GitHub repository

- A MongoDB connection string (from MongoDB Atlas or other source)

## Steps:

- Go to https://render.com and log in.

- Click "New Web Service" and connect the GitHub repo.

- Fill in the deploy form:

- Name: Character Maker

- Build Command: npm install

- Start Command: node index.js

- Environment Variable:

- Key: MONGODB_URI

- Value: MongoDB connection string (its a secret)

- Click "Create Web Service." Render will build and deploy your app.

- Once deployed, you’ll get a public URL where you can access your Character Maker app.


# Code

// Import required modules
const express = require('express');                 // Web framework for routing and server logic
const app = express();                              // Create an Express application instance
const path = require('path');                       // Node module for handling file paths
require('dotenv').config();                         // Load environment variables from a .env file
const methodOverride = require('method-override');  // Allow forms to use HTTP verbs like PUT and DELETE

// Middleware to serve static files (CSS, images, JS)
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// Import Mongoose and connect to MongoDB
const mongoose = require('mongoose');

// Middleware to parse incoming JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to override HTTP methods via query string (e.g., ?_method=DELETE)
app.use(methodOverride('_method'));

// Set EJS as the templating engine and define the views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Import the Character model (Mongoose schema)
const Character = require('./models/Character');

// Connect to MongoDB using environment variable from .env
mongoose.connect(process.env.URI)
  .then(() => console.log('Connected to MongoDB'))       // On successful connection
  .catch((err) => console.log('Connection error', err)); // On connection failure

// ROUTES

// GET /maker - Display all characters
app.get('/maker', async (req, res) => {
    let characters = await Character.find();             // Fetch all characters from the database
    res.render('maker', { characters });                 // Render the main maker page with character data
});

// GET /maker/new - Form to create a new character
app.get('/maker/new', async (req, res) => {
    res.render('maker/new');                             // Render new character form
});

// POST /maker - Create and save a new character
app.post('/maker', async (req, res) => {
    const { name, attack, defense, health, description } = req.body;
    await Character.create({ name, attack, defense, health, description }); // Save new character
    res.redirect('/maker');                              // Redirect to character list
});

// GET /maker/:id - Show details for one character
app.get('/maker/:id', async (req, res) => {
    const { id } = req.params;
    const character = await Character.findById(id);      // Find character by ID
    res.render('maker/id', { character });               // Render character details
});

// GET /maker/:id/edit - Show edit form for one character
app.get('/maker/:id/edit', async (req, res) => {
    const { id } = req.params;
    const character = await Character.findById(id);
    res.render('maker/edit', { character });             // Render form with current data
});

// PATCH /maker/:id - Update character's data
app.patch('/maker/:id', async (req, res) => {
    console.log("Updating...");
    const { id } = req.params;

    // Update each field individually (optional: refactor to one update call)
    await Character.findByIdAndUpdate(id, { $set: { name: req.body.name } });
    await Character.findByIdAndUpdate(id, { $set: { attack: req.body.attack } });
    await Character.findByIdAndUpdate(id, { $set: { defense: req.body.defense } });
    await Character.findByIdAndUpdate(id, { $set: { health: req.body.health } });
    await Character.findByIdAndUpdate(id, { $set: { description: req.body.description } });

    res.redirect(`/maker/${id}`);                        // Redirect back to character detail page
});

// DELETE /maker/:id - Remove a character
app.delete('/maker/:id', async (req, res) => {
    const { id } = req.params;
    await Character.findByIdAndDelete(id);               // Delete character from DB
    res.redirect('/maker');                              // Redirect to character list
});

// Start server on port 3000
app.listen(3000, () => {
    console.log('Listening on port 3000');
});

