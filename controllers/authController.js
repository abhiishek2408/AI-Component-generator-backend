import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import generateToken from './utils/generateToken.js';


export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ email, password });

  res.json({
    _id: user._id,
    email: user.email,
    token: generateToken(user._id, user.email) 
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id, user.email) 
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

export const getProfile = (req, res) => {
  res.json({
    id: req.user._id,
    email: req.user.email
  });
};
