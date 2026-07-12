import { userRepository, CreateUserInput, UpdateUserInput } from '../repositories/user.repository';
import { ConflictError, NotFoundError } from '../helpers/errors';

export class UserService {
  async getUsers(options: {
    page: number;
    limit: number;
    search?: string;
    is_active?: boolean;
  }) {
    return userRepository.findAll(options);
  }

  async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError(`User with id '${id}' not found.`);
    return user;
  }

  async createUser(input: CreateUserInput) {
    // Check email uniqueness
    const existing = await userRepository.findByEmail(input.email);
    if (existing) throw new ConflictError(`A user with email '${input.email}' already exists.`);
    const user = await userRepository.create(input);
    if (!user) throw new Error('Failed to create user.');
    return user;
  }

  async updateUser(id: string, input: UpdateUserInput) {
    // Check user exists
    const existing = await userRepository.findById(id);
    if (!existing) throw new NotFoundError(`User with id '${id}' not found.`);

    // Check email uniqueness if updating email
    if (input.email && input.email !== existing.email) {
      const emailTaken = await userRepository.findByEmail(input.email);
      if (emailTaken) throw new ConflictError(`Email '${input.email}' is already in use.`);
    }

    const updated = await userRepository.update(id, input);
    if (!updated) throw new Error('Failed to update user.');
    return updated;
  }

  async deleteUser(id: string) {
    const existing = await userRepository.findById(id);
    if (!existing) throw new NotFoundError(`User with id '${id}' not found.`);
    const deleted = await userRepository.softDelete(id);
    if (!deleted) throw new Error('Failed to delete user.');
    return { message: 'User deleted successfully.' };
  }

  async resetPassword(id: string, newPassword: string) {
    const existing = await userRepository.findById(id);
    if (!existing) throw new NotFoundError(`User with id '${id}' not found.`);
    const done = await userRepository.resetPassword(id, newPassword);
    if (!done) throw new Error('Failed to reset password.');
    return { message: 'Password reset successfully.' };
  }

  async assignRole(userId: string, roleId: string) {
    const existing = await userRepository.findById(userId);
    if (!existing) throw new NotFoundError(`User with id '${userId}' not found.`);
    await userRepository.assignRole(userId, roleId);
    return this.getUserById(userId);
  }

  async removeRole(userId: string, roleId: string) {
    const existing = await userRepository.findById(userId);
    if (!existing) throw new NotFoundError(`User with id '${userId}' not found.`);
    await userRepository.removeRole(userId, roleId);
    return this.getUserById(userId);
  }
}

export const userService = new UserService();
export default userService;
