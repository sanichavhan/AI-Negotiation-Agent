import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { AppError, successResponse, asyncHandler } from '../utils/errorHandler.js';

/**
 * Register new user
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req, res) => {
  const { username, email, password, displayName } = req.body;

  // Validation
  if (!username || !email || !password) {
    throw new AppError('Username, email, and password are required', 400);
  }

  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400);
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new AppError('User with this email or username already exists', 409);
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password,
    displayName: displayName || username,
  });

  // Generate token
  const token = generateToken(user._id);

  successResponse(res, 201, {
    token,
    user: user.toJSON(),
  }, 'User registered successfully');
});

/**
 * Login user
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  // Find user
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate token
  const token = generateToken(user._id);

  successResponse(res, 200, {
    token,
    user: user.toJSON(),
  }, 'Logged in successfully');
});

/**
 * Get user profile
 * GET /api/auth/profile
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  successResponse(res, 200, user.toJSON(), 'Profile retrieved');
});

/**
 * Update user profile
 * PUT /api/auth/profile
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { displayName, avatar } = req.body;

  const updates = {};
  if (displayName) updates.displayName = displayName;
  if (avatar) updates.avatar = avatar;

  const user = await User.findByIdAndUpdate(req.userId, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  successResponse(res, 200, user.toJSON(), 'Profile updated');
});

/**
 * Change password
 * POST /api/auth/change-password
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Validation
  if (!currentPassword || !newPassword) {
    throw new AppError(
      'Current password and new password are required',
      400
    );
  }

  if (newPassword.length < 6) {
    throw new AppError('New password must be at least 6 characters', 400);
  }

  const user = await User.findById(req.userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);

  if (!isPasswordValid) {
    throw new AppError('Current password is incorrect', 401);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  successResponse(res, 200, null, 'Password changed successfully');
});
