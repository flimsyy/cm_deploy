// Import the mongoose library to define a schema and interact with MongoDB
const mongoose = require('mongoose');

// Define a schema for the Character model, which represents how character data should be structured in the database
const characterSchema = new mongoose.Schema({
    // The character's name, which will be stored as a string
    name: String,
    // The attack value of the character, stored as a number
    attack: Number,
    // The defense value of the character, stored as a number
    defense: Number,
    // The health points of the character, stored as a number
    health: Number,
    // A description of the character, stored as a string
    description: String
});

// Export the Character model based on the defined schema
// This allows other files to interact with the Character collection in MongoDB
module.exports = mongoose.model('Character', characterSchema);
