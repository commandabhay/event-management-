// server/routes/users.js
const router = require('express').Router();
const bcrypt = require('bcryptjs');
let User = require('../models/user.model');

// Get all users
router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Register a new user
router.route('/register').post(async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
  
      if (!name || !email || !password) {
        return res.status(400).json('Name, email and password are required');
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json('User already exists');
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new User({ name, email, password: hashedPassword, role });
  
      const savedUser = await newUser.save();
  
      const userResponse = {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      };
  
      res.status(201).json(userResponse);
    } catch (err) {
      if (err && err.code === 11000) {
        return res.status(400).json('User already exists');
      }
      res.status(500).json('Error: ' + err);
    }
  });
// Login a user
router.route('/login').post(async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json('User not found');
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json('Invalid credentials');
        }

        // Don't send the password back to the client
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        res.json(userResponse);

    } catch (err) {
        res.status(500).json('Error: ' + err);
    }
});


// Get a user by ID
router.route('/:id').get((req, res) => {
    User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;