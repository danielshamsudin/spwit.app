const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    return jwt.sign({ userId }, 'testJWT', { expiresIn: '1h' });
};

exports.getAllUsers = async (req, res) => {
    try{
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: 'Server error: ' + e})
    }
}

exports.registerUser = async (req, res) => {
    const { name, email, password, phoneNumber } = req.body;

    console.log('raw:', req.body);
    console.log('data: ', name, email, password, phoneNumber);

    try {
        const existingUser = await User.findOne({ email });
        const existingPhone = await User.findOne({ phoneNumber });
        if (existingUser || existingPhone) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ name, email, password, phoneNumber });
        await user.save();
        const token = generateToken(user._id);
        res.status(201).json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProtectedData = (req, res) => {
    res.json({ message: 'This is protected data', userId: req.userId });
};

exports.addNameToList = async (req, res) => {
    const { name } = req.body;
    try {
        const user = await User.findById(req.userId);
        if (!user){
            return res.status(404).json({message: 'User not found'});
        }

        if (user.names.includes(name)){
            return res.status(400).json({message: 'User exists in list'});
        }

        user.names.push(name);
        await user.save();
        res.status(200).json({ message: 'Name added.' });
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
}

exports.getUserNames = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user){
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json({ names: user.names});
    }catch (error) {
        res.status(500).json({ message: 'Server error'});
    }
}

exports.removeNameFromList = async (req, res) => {
    const { name } = req.body;

    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.names.includes(name)) {
            return res.status(400).json({ message: 'Name does not exist in your list' });
        }

        user.names = user.names.filter(n => n !== name);
        await user.save();

        res.status(200).json({ 
            message: 'Name removed from your list', 
            names: user.names 
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

