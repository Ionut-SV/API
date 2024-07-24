const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    title: String,
    type: String,
    difficulty: String,
    description: String,
    filename: String
});

const File = mongoose.model('File', fileSchema);
module.exports = File;