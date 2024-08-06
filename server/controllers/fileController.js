const mongoose = require('mongoose');
const { MongoClient, GridFSBucket } = require('mongodb');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const User = require('../models/userModel');

const mongoURI = 'mongodb+srv://telacad:telacad2024@telacad.ms1pwzj.mongodb.net/?retryWrites=true&w=majority&appName=Telacad';
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

let gfsBucket;
client.connect().then(() => {
    const db = client.db('test');
    gfsBucket = new GridFSBucket(db, {
        bucketName: 'uploads'
    });
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

// Create storage engine
exports.uploadFile = async (req, res) => {
    
    console.log('User information in uploadFile:', req.user);
    if (!req.user) {
        return res.status(400).json({ error: 'User not authenticated' });
    }

    // Fetch user details if not present in req.user
    if (!req.user.name) {
        try {
            const userId = new mongoose.Types.ObjectId(req.user.id); // Convert to ObjectId
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            req.user.name = user.name;
            req.user.score = user.score; 
            req.user.rank = user.rank;
            console.log('Fetched user name:', req.user.name); // Log fetched user name
        } catch (err) {
            console.error('Error fetching user details:', err);
            return res.status(500).json({ error: 'An error occurred while fetching user details' });
        }
    }
    const storage = new GridFsStorage({
        url: mongoURI,
        options: { useNewUrlParser: true, useUnifiedTopology: true },
        file: (req, file) => {
            // Add logging here to check if req.user is available inside file function
            console.log('User information in GridFsStorage file function:', req.user);
            if (!req.user || !req.user.id) {
                throw new Error('User not authenticated');
            }
            return {
                bucketName: 'uploads', // Collection name in MongoDB
                filename: `${Date.now()}-${file.originalname}`,
                metadata: {
                    title: req.body.title,
                    type: req.body.type,
                    difficulty: req.body.difficulty,
                    description: req.body.description,
                    name: req.user.name ,
                    userId: req.user.id
                }
            };
        }
    });

    const upload = multer({ storage }).single('file');

    upload(req, res, async (err) => {
        if (err) {
            console.error('Upload error:', err); // Log error details
            return res.status(500).json({ error: 'An error occurred while uploading the file', details: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file was uploaded' });
        }

        console.log('Uploaded file:', req.file); // Log file details for debugging 
        try {
            const userId = new mongoose.Types.ObjectId(req.user.id);
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Increase score by 100
            user.score += 100;

            // Update rank based on the score
            if (user.score >= 1000) {
                user.rank = 'Expert';
            } else if (user.score >= 500) {
                user.rank = 'Intermediate';
            } else {
                user.rank = 'Beginner';
            }

            await user.save();

            res.status(201).json({
                message: 'File uploaded successfully',
                file: req.file,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    rank: user.rank,
                    score: user.score,
                },
            });
        } catch (err) {
            console.error('Error updating user score and rank:', err);
            return res.status(500).json({ error: 'An error occurred while updating user score and rank' });
        }
        return res.status(201).json({ message: 'File uploaded successfully', file: req.file });
    });
};

exports.getFiles = async (req, res) => {
    try {
        const files = await gfsBucket.find().toArray();
        if (!files || files.length === 0) {
            return res.status(404).json({ message: 'No files available' });
        }
        res.status(200).json(files);
    } catch (err) {
        console.error('Error retrieving files:', err);
        res.status(500).json({ error: 'An error occurred while retrieving files' });
    }
};

exports.getFileByName = async (req, res) => {
    const { filename } = req.params;

    if (!gfsBucket) {
        return res.status(500).json({ error: 'GridFSBucket is not initialized' });
    }

    try {
        const files = await gfsBucket.find({ filename }).toArray();
        if (!files || files.length === 0) {
            return res.status(404).json({ message: 'File not found' });
        }

        const file = files[0];
        const readstream = gfsBucket.openDownloadStream(file._id);

        res.setHeader('Content-Type', file.contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);

        readstream.on('error', (err) => {
            res.status(500).json({ error: 'An error occurred while streaming the file' });
        });

        readstream.pipe(res);
    } catch (err) {
        console.error('Error finding file:', err);
        res.status(500).json({ error: 'An error occurred while retrieving the file' });
    }
};

exports.getFileById = async (req, res) => {
    const { id } = req.params;

    if (!gfsBucket) {
        return res.status(500).json({ error: 'GridFSBucket is not initialized' });
    }

    try {
        // Convert id to ObjectId if necessary
        const objectId = new mongoose.Types.ObjectId(id);

        // Find the file by its ObjectId
        const files = await gfsBucket.find({ _id: objectId }).toArray();

        if (files.length === 0) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Send file metadata
        const file = files[0];
        res.status(200).json({
            id: file._id,
            filename: file.filename,
            contentType: file.contentType,
            length: file.length,
            uploadDate: file.uploadDate,
            metadata: file.metadata // Ensure metadata is included
        });
    } catch (err) {
        console.error('Error finding file:', err);
        res.status(500).json({ error: 'An error occurred while retrieving the file' });
    }
};


exports.getUserFiles = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(400).json({ error: 'User not authenticated' });
    }

    try {
    
        const userId = req.user.id.toString();
        // console.log('User ID:', userId); // Debugging log

        const files = await gfsBucket.find({ 'metadata.userId': userId }).toArray();

        if (files.length === 0) {
            console.log('No files found for the current user'); // Debugging log
            return res.status(404).json({ message: 'No files found for the current user' });
        }

        res.status(200).json(files);
    } catch (err) {
        console.error('Error retrieving user files:', err);
        // Ensure only one response is sent
        if (!res.headersSent) {
            res.status(500).json({ error: 'An error occurred while retrieving user files' });
        }
    }
};
