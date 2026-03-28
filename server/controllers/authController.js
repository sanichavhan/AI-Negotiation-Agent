import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { successResponse, errorResponse, asyncHandler } from '../utils/errorHandler.js';
import { AppError } from '../utils/errorHandler.js';

/**
 * Register new user
 */
export const register = asyncHandler(async (req, res) => {
  const { username, email, password, displayName } = req.body;

  // Validate required fields
  if (!username || !email || !password) {
    throw new AppError('Please provide username, email, and password', 400);
  }

  // Check if user already exists
  let user = await User.findOne({ $or: [{ email }, { username }] });
  if (user) {
    throw new AppError('User already exists with that email or username', 400);
  }

  // Create new user
  user = new User({
    username,
    email,
    password,
    displayName: displayName || username,
  });

  await user.save();

  // Generate token
  const token = generateToken(user._id);

  successResponse(
    res,
    201,
    {
      user: user.toJSON(),
      token,
    },
    'User registered successfully'
  );
});

/**
 * Login user
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }

  // Find user by email
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

  successResponse(
    res,
    200,
    {
      user: user.toJSON(),
      token,
    },
    'Login successful'
  );
});

/**
 * Get current user profile
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  successResponse(res, 200, user.toJSON(), 'Profile retrieved successfully');
});

/**
 * Update user profile
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { displayName, avatar } = req.body;

  const user = await User.findByIdAndUpdate(
    req.userId,
    {
      ...(displayName && { displayName }),
      ...(avatar && { avatar }),
    },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  successResponse(
    res,
    200,
    user.toJSON(),
    'Profile updated successfully'
  );
});

/**
 * Change password
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError(
      'Please provide current password and new password',
      400
    );
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

  successResponse(res, 200, {}, 'Password changed successfully');
});
