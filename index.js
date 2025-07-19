// Import required modules
const express = require('express'); // Web framework for handling routes and HTTP requests
const app = express(); // Initialize the Express application
const path = require('path'); // Module for working with file and directory paths

require('dotenv').config()
const methodOverride = require('method-override'); // Middleware to support HTTP verbs like PUT and DELETE

// Serve static files (like images, CSS, etc.) from the public directory
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public'))); // Another way to join the directory

// Import Mongoose for MongoDB interaction
const mongoose = require('mongoose');

// Middleware for parsing JSON and form data
app.use(express.json()); // To parse JSON data in request bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded form data

// Middleware for overriding HTTP methods (like PATCH and DELETE through forms)
app.use(methodOverride('_method'));

// Set the view engine to EJS (Embedded JavaScript) and specify where view files are stored
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views')); // Use the views directory for EJS templates

// Import the Character model
const Character = require('./models/Character');

// Connect to MongoDB using mongoose, handling success and error cases
mongoose.connect(process.env.URI)
  .then(() => console.log('Connected to MongoDB')) // Log success message if connection works
  .catch((err) => console.log('Connection error', err)); // Log error if connection fails

// Route to display all characters on the character maker page
app.get('/maker', async (req, res) => {
    let characters = await Character.find(); // Retrieve all characters from the database
    res.render('maker', { characters }); // Render the maker view and pass the characters to it
});

// Route to show the form for creating a new character
app.get('/maker/new', async (req, res) => {
    res.render('maker/new'); // Render the form to create a new character
});

// Route to handle the creation of a new character
app.post('/maker', async (req, res) => {
    const { name, attack, defense, health, description } = req.body; // Extract data from the form
    await Character.create({ name, attack, defense, health, description }); // Create a new character in the database
    res.redirect('maker'); // After creation, redirect to the main character maker page
});

// Route to display details of a specific character by ID
app.get('/maker/:id', async (req, res) => {
    const { id } = req.params; // Extract the character ID from the URL
    const character = await Character.findById(id); // Find the character in the database by ID
    res.render('maker/id', { character }); // Render the character detail page and pass the character data
});

// Route to show the form for editing a specific character
app.get('/maker/:id/edit', async (req, res) => {
    const { id } = req.params; // Extract the character ID from the URL
    const character = await Character.findById(id); // Find the character by ID
    res.render('maker/edit', { character }); // Render the edit form with the current character data
});

// Route to handle updates to a specific character
app.patch('/maker/:id', async (req, res) => {
    console.log("Updating...");
    const { id } = req.params; // Extract the character ID from the URL

    // Use separate update operations for each field (could be optimized to update all fields at once)
    await Character.findByIdAndUpdate(id, { $set: { name: req.body.name } });
    await Character.findByIdAndUpdate(id, { $set: { attack: req.body.attack } });
    await Character.findByIdAndUpdate(id, { $set: { defense: req.body.defense } });
    await Character.findByIdAndUpdate(id, { $set: { health: req.body.health } });
    await Character.findByIdAndUpdate(id, { $set: { description: req.body.description } });
    
    res.redirect(`/maker/${id}`); // After updating, redirect to the character's detail page
});

// Route to delete a specific character
app.delete('/maker/:id', async (req, res) => {
    const { id } = req.params; // Extract the character ID from the URL
    await Character.findByIdAndDelete(id); // Find and delete the character by ID
    res.redirect('/maker'); // After deletion, redirect to the character maker page
});

// Start the Express server on port 8080
app.listen(3000, () => {
    console.log('Listening on port 8080');
});
