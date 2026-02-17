import store from '../store';
import { User, UserProfile } from '../types';

export class UserRepository {
  /**
   * Find all users
   */
  findAll(): User[] {
    return store.getUsers();
  }

  /**
   * Find user by ID
   */
  findById(id: string): User | undefined {
    return store.getUserById(id);
  }

  /**
   * Find user by email
   */
  findByEmail(email: string): User | undefined {
    return store.getUserByEmail(email);
  }

  /**
   * Create a new user
   */
  create(user: User): User {
    return store.createUser(user);
  }

  /**
   * Update a user
   */
  update(id: string, updates: Partial<User>): User | undefined {
    return store.updateUser(id, updates);
  }

  /**
   * Delete a user
   */
  delete(id: string): boolean {
    return store.deleteUser(id);
  }

  /**
   * Get user profile with agents
   */
  getProfile(id: string): UserProfile | undefined {
    const user = this.findById(id);
    if (!user) return undefined;

    // Get user's owned agents
    const agents = store.getAgents().filter(a => a.authorId === id);
    const ownedAgents = agents.map(a => a.id);

    // Get user's deployments
    const deployments = store.getDeploymentsByUserId(id);
    const deployedAgents = [...new Set(deployments.map(d => d.agentId))];

    return {
      id: `profile-${id}`,
      userId: id,
      ownedAgents,
      deployedAgents,
      totalEarnings: agents.reduce((sum, a) => sum + (a.price * a.downloads), 0),
    };
  }

  /**
   * Validate user credentials (simplified for demo)
   */
  validateCredentials(email: string, _password: string): User | undefined {
    const user = this.findByEmail(email);
    // In production, verify password hash here
    return user;
  }
}

export const userRepository = new UserRepository();
export default userRepository;
