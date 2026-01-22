const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password, role });
        res.status(201).json({
            _id: user._id, 
            name: user.name, 
            email: user.email,
            role: user.role,
            likedBooks: user.likedBooks || [],
            token: generateToken(user._id),
        });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Auth user & get token (Login)
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                likedBooks: user.likedBooks || [], // Use likedBooks consistently
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user by ID (Used by Profile page for fresh data)
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) res.json(user);
        else res.status(404).json({ message: 'User not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};