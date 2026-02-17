import { v4 as uuidv4 } from 'uuid';
import { User, UserProfile, AppError, ErrorCode } from '../types';
import { userRepository } from '../repositories';

export class UserService {
  /**
   * Get all users
   */
  getAllUsers(): User[] {
    return userRepository.findAll();
  }

  /**
   * Get user by ID
   */
  getUserById(id: string): User {
    const user = userRepository.findById(id);
    if (!user) {
      throw new AppError(ErrorCode.NOT_FOUND, 'User not found', 404);
    }
    return user;
  }

  /**
   * Get user by email
   */
  getUserByEmail(email: string): User | undefined {
    return userRepository.findByEmail(email);
  }

  /**
   * Create a new user
   */
  createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    // Check if email already exists
    const existingUser = userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError(ErrorCode.CONFLICT, 'Email already in use', 409);
    }

    const user: User = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return userRepository.create(user);
  }

  /**
   * Update a user
   */
  updateUser(id: string, updates: Partial<User>): User {
    const user = this.getUserById(id);
    
    // Prevent updating certain fields
    const protectedFields = ['id', 'createdAt', 'role'];
    const safeUpdates = { ...updates };
    protectedFields.forEach(field => delete safeUpdates[field as keyof typeof safeUpdates]);

    // If email is being updated, check for conflicts
    if (safeUpdates.email && safeUpdates.email !== user.email) {
      const existingUser = userRepository.findByEmail(safeUpdates.email);
      if (existingUser) {
        throw new AppError(ErrorCode.CONFLICT, 'Email already in use', 409);
      }
    }

    const updated = userRepository.update(id, { ...safeUpdates, updatedAt: new Date() });
    if (!updated) {
      throw new AppError(ErrorCode.INTERNAL_ERROR, 'Failed to update user', 500);
    }
    
    return updated;
  }

  /**
   * Delete a user
   */
  deleteUser(id: string): void {
    this.getUserById(id); // Verify user exists
    userRepository.delete(id);
  }

  /**
   * Get user profile
   */
  getUserProfile(id: string): UserProfile {
    this.getUserById(id); // Verify user exists
    const profile = userRepository.getProfile(id);
    if (!profile) {
      throw new AppError(ErrorCode.INTERNAL_ERROR, 'Failed to get user profile', 500);
    }
    return profile;
  }

  /**
   * Authenticate user (simplified for demo)
   */
  authenticateUser(email: string, password: string): User {
    const user = userRepository.validateCredentials(email, password);
    if (!user) {
      throw new AppError(ErrorCode.UNAUTHORIZED, 'Invalid credentials', 401);
    }
    return user;
  }

  /**
   * Change user role (admin only)
   */
  changeUserRole(userId: string, role: User['role']): User {
    const user = this.getUserById(userId);
    
    const updated = userRepository.update(userId, { role, updatedAt: new Date() });
    if (!updated) {
      throw new AppError(ErrorCode.INTERNAL_ERROR, 'Failed to update user role', 500);
    }
    
    return updated;
  }
}

export const userService = new UserService();
export default userService;
